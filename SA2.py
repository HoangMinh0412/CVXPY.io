import sys
sys.stdout.reconfigure(encoding='utf-8')

import math
import random

# Hàm tính khoảng cách giữa hai điểm
def distance(point1, point2):
    return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)

# Hàm tính tổng chiều dài chu trình
def total_distance(route, points):
    return sum(distance(points[route[i]], points[route[i+1]]) for i in range(len(route)-1)) + distance(points[route[-1]], points[route[0]])

# Thuật toán Simulated Annealing để giải TSP
def simulated_annealing_tsp(points, max_iterations, initial_temp, cooling_rate):
    # Tạo chu trình ban đầu (random)
    current_route = list(range(len(points)))
    random.shuffle(current_route)
    current_distance = total_distance(current_route, points)
    best_route = current_route[:]
    best_distance = current_distance
    temperature = initial_temp

    for iteration in range(max_iterations):
        # Tạo một hoán đổi mới (neighbor solution)
        new_route = current_route[:]
        i, j = random.sample(range(len(points)), 2)
        new_route[i], new_route[j] = new_route[j], new_route[i]
        new_distance = total_distance(new_route, points)

        # Tính xác suất chấp nhận nghiệm mới
        delta = new_distance - current_distance
        acceptance_probability = math.exp(-delta / temperature) if delta > 0 else 1

        # Chấp nhận nghiệm mới nếu cần
        if random.random() < acceptance_probability:
            current_route = new_route[:]
            current_distance = new_distance

        # Cập nhật nghiệm tốt nhất
        if current_distance < best_distance:
            best_route = current_route[:]
            best_distance = current_distance

        # Giảm nhiệt độ
        temperature *= cooling_rate

    return best_route, best_distance

# Tham số và chạy thuật toán
points = [(0, 0), (2, 3), (5, 2), (7, 8), (6, 4)]  # Danh sách tọa độ các điểm
max_iterations = 1000
initial_temp = 100.0
cooling_rate = 0.98

route, distance_result = simulated_annealing_tsp(points, max_iterations, initial_temp, cooling_rate)
print(f"Lộ trình tối ưu: {route}, Tổng khoảng cách: {distance_result}")