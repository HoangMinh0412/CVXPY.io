import sys
sys.stdout.reconfigure(encoding='utf-8')

import cvxpy as cp
import numpy as np

I = 2   # Số RU
B = 3   # Số RB mỗi RU
K = 4   # Số người dùng (slice)

# Tham số của bài toán
gamma = 0.5         # Hệ số cân bằng giữa số slice phục vụ và throughput
tuning_coef = 1.0   # Hệ số tuning (hỗ trợ tối đa số slice phục vụ)
Rmin = 0.5          # Data rate tối thiểu cho người dùng được phục vụ
RU_Pmax = 10.0      # Công suất tối đa của mỗi RU (tổng trên các RB)
RB_Pmax = 5.0       # Giới hạn công suất mỗi RB (dùng cho quy đổi liên quan đến x và p)
RB_bw = 1.0         # Băng thông của mỗi RB

# alpha[i,b,k] gồm hiệu dụng của kênh, tác động của P, hệ số bình thường hóa (B,No,...)
alpha = np.random.uniform(low=0.5, high=1.5, size=(I, B, K))
# các biến
# x[i,b,k]: biến nhị phân =1 nếu RB b của RU i được cấp cho người dùng k
x = cp.Variable((I, B, K), boolean=True)

# y[k]: biến nhị phân cho biết người dùng k có được phục vụ (các RB của nó được cấp phát hay không)
y = cp.Variable(K, boolean=True)

# p[i,b,k]: lượng công suất cấp cho RB b của RU i cho người dùng k
p = cp.Variable((I, B, K), nonneg=True)

# q[i,b,k]: biến mới để biểu diễn tích (x * p) nhằm đưa công thức về dạng tuyến tính (với x là biến nhị phân)
q = cp.Variable((I, B, K), nonneg=True)

# ----------------------------- Ràng buộc -----------------------------
constraints = []

# 1. Ràng buộc liên hệ giữa x và y:
# Nếu người dùng k được cấp phát ít nhất một RB (∑ x[i,b,k] >= 1) thì y[k] = 1, ngược lại y[k] = 0.
M = I * B  # hằng số lớn
for k in range(K):
    constraints.append(cp.sum(x[:, :, k]) >= y[k])
    constraints.append(cp.sum(x[:, :, k]) <= M * y[k])

# 2. Mỗi RB chỉ được cấp phát cho tối đa một người dùng tại một thời điểm:
for i in range(I):
    for b in range(B):
        constraints.append(cp.sum(x[i, b, :]) <= 1)

# 3. Ràng buộc tổng công suất truyền của mỗi RU không vượt quá RU_Pmax:
for i in range(I):
    constraints.append(cp.sum(p[i, :, :]) <= RU_Pmax)

# 4. Liên hệ giữa p, x và q:
# Ta muốn q[i,b,k] = x[i,b,k] * p[i,b,k]. Để đảm bảo điều này theo dạng tuyến tính, ta dùng các ràng buộc:
for i in range(I):
    for b in range(B):
        for k in range(K):
            constraints.append(q[i, b, k] <= p[i, b, k])
            constraints.append(q[i, b, k] <= RB_Pmax * x[i, b, k])
            constraints.append(q[i, b, k] >= p[i, b, k] - RB_Pmax * (1 - x[i, b, k]))
            constraints.append(q[i, b, k] >= 0)

# 5. Tính Service Rate cho người dùng k sử dụng định lý Shannon:
# R_k = sum_{i,b} RB_bw * log(1 + alpha[i,b,k] * q[i,b,k])
# Áp dụng ràng buộc: nếu người dùng k được phục vụ (y[k]=1) thì R_k không thấp hơn Rmin.
R_list = []
for k in range(K):
    rate_terms = []
    for i in range(I):
        for b in range(B):
            # Lưu ý: cp.log là log tự nhiên. Vì hàm log là hàm tăng nên thứ tự tối ưu không thay đổi.
            rate_terms.append(RB_bw * cp.log(1 + alpha[i, b, k] * q[i, b, k]))
    # Tổng tốc độ phục vụ cho người dùng k:
    R_k = cp.sum(cp.hstack(rate_terms))
    R_list.append(R_k)
# Chuyển danh sách R_list thành một vector
R_vec = cp.hstack(R_list)

# 6. Ràng buộc dữ liệu rate tối thiểu (nếu người dùng được phục vụ y[k]=1 thì R_vec[k] >= Rmin):
for k in range(K):
    constraints.append(R_vec[k] >= Rmin * y[k])

# ----------------------------- Hàm mục tiêu -----------------------------
# Mục tiêu là tối đa hóa hỗn hợp giữa số slice được phục vụ (xác định bằng y) và tổng throughput của mạng.
# Ở đây, hàm mục tiêu được định nghĩa là:
#   maximize   tuning_coef * (∑ y[k]) + (1 - gamma) * (∑ R_vec[k])
objective = cp.Maximize(tuning_coef * cp.sum(y) + (1 - gamma) * cp.sum(R_vec))

# ----------------------------- Định nghĩa và giải bài toán -----------------------------
prob = cp.Problem(objective, constraints)

# Lưu ý: Vì đây là bài toán hỗn hợp (các biến nhị phân và phi tuyến), bạn có thể cần dùng solver hỗ trợ MIP, ví dụ: ECOS_BB.
result = prob.solve(solver=cp.MOSEK , verbose=True)

print("Giá trị mục tiêu tối ưu:", prob.value)
print("Phân bố RB (x):")
print(x.value)
print("Chỉ số người dùng được phục vụ (y):")
print(y.value)
print("Công suất phân bổ trên mỗi RB (p):")
print(p.value)
