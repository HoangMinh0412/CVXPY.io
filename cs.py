from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus, value
import numpy as np

# Parameters
roll_width = 100
widths = [14, 31, 36, 45]  # Order widths
orders = [211, 395, 610, 97]  # Quantity ordered

# Step 1: Initialize patterns (each width cut individually as a start)
patterns = []
for width in widths:
    pattern = [roll_width // width if i == widths.index(width) else 0 for i in range(len(widths))]
    patterns.append(pattern)

# Function to calculate new patterns using knapsack subproblem
def generate_pattern(prices):
    from scipy.optimize import linprog
    c = [-price for price in prices]  # Maximize dual values
    A_ub = [widths]
    b_ub = [roll_width]
    bounds = [(0, None) for _ in widths]  # Integer bounds

    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method='highs')
    if res.success and -res.fun > 1:  # Reduced cost criteria
        return [int(round(x)) for x in res.x]
    else:
        return None

# Step 2: Solve the master problem iteratively
while True:
    # Define the master problem
    prob = LpProblem("Cutting_Stock", LpMinimize)
    cut_vars = [LpVariable(f"Cut_{j}", lowBound=0, cat="Integer") for j in range(len(patterns))]

    # Objective function
    prob += lpSum(cut_vars), "Minimize Rolls Used"

    # Constraints (satisfy demand)
    for i, order in enumerate(orders):
        prob += lpSum(pattern[i] * cut_vars[j] for j, pattern in enumerate(patterns)) >= order, f"Demand_{widths[i]}"

    # Solve master problem
    prob.solve()
    
    # Extract dual prices
    dual_prices = [prob.constraints[f"Demand_{width}"].pi for width in widths]

    # Generate new pattern using knapsack subproblem
    new_pattern = generate_pattern(dual_prices)
    if new_pattern is None:  # No new patterns with reduced cost
        break

    # Add new pattern to patterns list
    patterns.append(new_pattern)

# Display results
print(f"Status: {LpStatus[prob.status]}")
print(f"Total Rolls Used: {value(prob.objective)}")
for j, cut in enumerate(cut_vars):
    if cut.varValue > 0:
        print(f"Pattern {j}: {cut.varValue}, {patterns[j]}")