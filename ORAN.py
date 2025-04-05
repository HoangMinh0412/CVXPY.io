import sys
sys.stdout.reconfigure(encoding='utf-8')

import cvxpy as cp
import numpy as np
import time
import csv

# ------------------- THIẾT LẬP THAM SỐ -------------------
I = 2     # Số RU (Resource Unit)
B = 3     # Số RB (Resource Block) mỗi RU
K = 4     # Số người dùng (slice)

# Các tham số của bài toán
gamma       = 0.5       # Hệ số cân bằng giữa số slice phục vụ và throughput
tuning_coef = 1.0       # Hệ số tuning (hỗ trợ tối đa số slice phục vụ)
Rmin        = 0.5       # Data rate tối thiểu cho người dùng được phục vụ
RU_Pmax     = 10.0      # Công suất tối đa của mỗi RU (tổng trên các RB)
RB_Pmax     = 5.0       # Giới hạn công suất cho mỗi RB (sử dụng trong quan hệ x và p)
RB_bw       = 1.0       # Băng thông của mỗi RB

# Hiệu dụng của kênh giữa RU và người dùng
alpha = np.random.uniform(low=0.5, high=1.5, size=(I, B, K))

# ------------------ KHỞI TẠO BIẾN QUYẾT ĐỊNH ------------------
# x[i,b,k]: biến nhị phân = 1 nếu RB b của RU i được cấp cho người dùng k
x = cp.Variable((I, B, K), boolean=True)
# y[k]: biến nhị phân cho biết người dùng k có được phục vụ (các RB của nó được cấp phát hay không)
y = cp.Variable(K, boolean=True)
# p[i,b,k]: lượng công suất cấp cho RB b của RU i cho người dùng k
p = cp.Variable((I, B, K), nonneg=True)
# q[i,b,k]: biến mới biểu diễn tích (x * p) để đưa bài toán về dạng tuyến tính
q = cp.Variable((I, B, K), nonneg=True)

# ------------------- XÂY DỰNG RÀNG BUỘC -------------------
constraints = []

# 1. Ràng buộc liên hệ giữa x và y:
# Nếu người dùng k được cấp phát ít nhất 1 RB thì y[k] = 1, ngược lại y[k] = 0.
M = I * B  # hằng số lớn
for k in range(K):
    constraints.append(cp.sum(x[:, :, k]) >= y[k])
    constraints.append(cp.sum(x[:, :, k]) <= M * y[k])

# 2. Mỗi RB chỉ được cấp phát cho tối đa 1 người dùng tại một thời điểm:
for i in range(I):
    for b in range(B):
        constraints.append(cp.sum(x[i, b, :]) <= 1)

# 3. Tổng công suất truyền của mỗi RU không vượt quá RU_Pmax:
for i in range(I):
    constraints.append(cp.sum(p[i, :, :]) <= RU_Pmax)

# 4. Liên hệ giữa p, x và q: q = x*p ==> đưa về dạng tuyến tính
for i in range(I):
    for b in range(B):
        for k in range(K):
            constraints.append(q[i, b, k] <= p[i, b, k])
            constraints.append(q[i, b, k] <= RB_Pmax * x[i, b, k])
            constraints.append(q[i, b, k] >= p[i, b, k] - RB_Pmax * (1 - x[i, b, k]))
            constraints.append(q[i, b, k] >= 0)

# 5. Tính service rate của người dùng theo định lý Shannon:
# R_k = ∑₍ᵢ, ₍b₎₎ RB_bw * log(1 + alpha[i,b,k] * q[i,b,k])
R_list = []
for k in range(K):
    rate_terms = []
    for i in range(I):
        for b in range(B):
            # cp.log là log tự nhiên, thứ tự tối ưu không thay đổi
            rate_terms.append(RB_bw * cp.log(1 + alpha[i, b, k] * q[i, b, k]))
    R_k = cp.sum(cp.hstack(rate_terms))
    R_list.append(R_k)
# Gom các tốc độ thành vector
R_vec = cp.hstack(R_list)

# 6. Ràng buộc dữ liệu rate tối thiểu: nếu người dùng k được phục vụ (y[k]=1) thì R_vec[k] >= Rmin
for k in range(K):
    constraints.append(R_vec[k] >= Rmin * y[k])

# --------------------- HÀM MỤC TIÊU ---------------------
# Mục tiêu tối đa hoá: tuning_coef * (∑ y[k]) + (1-gamma) * (∑ R_vec[k])
objective = cp.Maximize(tuning_coef * cp.sum(y) + (1 - gamma) * cp.sum(R_vec))
prob = cp.Problem(objective, constraints)

# --------------------- GIẢI BÀI TOÁN ILP ---------------------
start_time = time.time()
result = prob.solve(solver=cp.MOSEK, verbose=True)
time_ILP = time.time() - start_time

# In một vài kết quả cơ bản ra màn hình
print("Giá trị mục tiêu tối ưu:", prob.value)
print("Phân bố RB (x):")
print(x.value)
print("Chỉ số người dùng được phục vụ (y):")
print(y.value)
print("Công suất phân bổ trên mỗi RB (p):")
print(p.value)

# --------------------- TÍNH TOÁN CÁC CHỈ SỐ ILP ---------------------
# Tính tổng throughput từ các kết quả giải được (tính theo công thức Shannon)
throughput_ILP = 0.0
for k in range(K):
    rate_k = 0.0
    for i in range(I):
        for b in range(B):
            val = q.value[i, b, k]
            rate_k += RB_bw * np.log(1 + alpha[i, b, k] * val)
    throughput_ILP += rate_k

numuser_ILP = int(round(np.sum(y.value)))
check_ILP   = prob.status in ["optimal", "optimal_inaccurate"]

# --------------------- GIÁ TRỊ GIẢ ĐỊNH CHO SA ---------------------
# Những chỉ số sau đây chỉ là giá trị mẫu để demo định dạng CSV.
step_SA         = 5000
numuser_SA      = numuser_ILP
throughput_SA   = throughput_ILP * 0.68  # Giả sử throughput của SA thấp hơn ILP khoảng 32%
time_SA         = 30.0                # Giả sử thời gian chạy SA là 30 giây
time_rate       = time_ILP / time_SA if time_SA != 0 else None
serve_rate      = 100.0               # Giả sử serve rate là 100%
throughput_rate = throughput_SA - throughput_ILP

# --------------------- XUẤT KẾT QUẢ DẠNG CSV ---------------------
# Theo mẫu đầu ra của bạn, ta định nghĩa một số trường cố định (bạn có thể thay đổi theo nhu cầu)
csv_id         = 0
csv_numuser    = 10                      # Mẫu CSV có số user là 10
csv_numRU      = 10                      # Mẫu CSV có số RU là 10
csv_RBeachRU   = "[5, 6, 7, 8, 9, 10, 5, 5, 5, 5]"

# Header và thứ tự các cột theo mẫu
csv_header = [
    "id", "numuser", "numRU", "RBeachRU", "time_ILP", "throughput_ILP",
    "numuser_ILP", "check_ILP", "step_SA", "numuser_SA", "throughput_SA",
    "time_SA", "time_rate", "serve_rate", "throughput_rate"
]

csv_row = [
    csv_id, csv_numuser, csv_numRU, csv_RBeachRU, time_ILP, throughput_ILP,
    numuser_ILP, check_ILP, step_SA, numuser_SA, throughput_SA, time_SA,
    time_rate, serve_rate, throughput_rate
]

print("\nOutput CSV:")
print(",".join(str(item) for item in csv_header))
print(",".join(str(item) for item in csv_row))

  # Đảm bảo import csv ở đầu file


"""
    Lưu thông tin vào file output (csv)
"""
def write_data_test(output_file: str, id: int, numuser: int, numRU: int, RBeachRU: str,
                    time_ILP: float, throughput_ILP: float, numuser_ILP: int, check_ILP: bool,
                    step_SA: int, numuser_SA: int, throughput_SA: float, time_SA: float):
    with open(output_file, 'a', newline='', encoding='utf-8') as opf:
        writer = csv.writer(opf)
        
        # Tính toán các chỉ số bổ sung
        time_rate = time_ILP / time_SA if time_SA != 0 else None
        serve_rate = (numuser_SA / numuser_ILP) * 100 if numuser_ILP != 0 else 0
        throughput_rate = ((throughput_SA - throughput_ILP) / throughput_ILP) * 100 if throughput_ILP != 0 else 0
        
        # Ghi dữ liệu vào file
        writer.writerow([
            id, numuser, numRU, RBeachRU, time_ILP, throughput_ILP, numuser_ILP, check_ILP,
            step_SA, numuser_SA, throughput_SA, time_SA, time_rate, serve_rate, throughput_rate
        ])
        
