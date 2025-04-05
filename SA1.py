import sys
sys.stdout.reconfigure(encoding='utf-8')

import math
import random

# Hàm mục tiêu
def objective_function(x):
    return x**2

# Thuật toán Simulated Annealing
def simulated_annealing(objective, bounds, max_iterations, initial_temp, cooling_rate):
    # Khởi tạo
    current_solution = random.uniform(bounds[0], bounds[1])
    current_value = objective(current_solution)
    best_solution = current_solution
    best_value = current_value
    temperature = initial_temp

    for iteration in range(max_iterations):
        # Tạo một nghiệm mới ngẫu nhiên
        new_solution = current_solution + random.uniform(-1, 1)
        new_solution = max(bounds[0], min(bounds[1], new_solution))  # Đảm bảo trong phạm vi
        new_value = objective(new_solution)

        # Tính toán xác suất chấp nhận nghiệm mới
        delta = new_value - current_value
        acceptance_probability = math.exp(-delta / temperature) if delta > 0 else 1

        # Quyết định có chấp nhận nghiệm mới không
        if random.random() < acceptance_probability:
            current_solution = new_solution
            current_value = new_value

        # Cập nhật nghiệm tốt nhất
        if current_value < best_value:
            best_solution = current_solution
            best_value = current_value

        # Giảm nhiệt độ
        temperature *= cooling_rate

    return best_solution, best_value

# Tham số và chạy thuật toán
bounds = [-10, 10]  # Phạm vi tìm kiếm
max_iterations = 1000
initial_temp = 100.0
cooling_rate = 0.99

solution, value = simulated_annealing(objective_function, bounds, max_iterations, initial_temp, cooling_rate)
print(f"Nghiệm tối ưu: {solution}, Giá trị: {value}")