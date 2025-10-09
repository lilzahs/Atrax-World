# 🚀 Quick Test - Atrax-World Game

## ⚡ Test nhanh trong 5 phút

### Bước 1: Copy Game Files (Thủ công)

**Mở Finder và copy:**
```
FROM: /Users/doandothanhdanh/Desktop/zah project/clash-of-clans-clone/
TO:   /Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game/

Copy these folders:
- Client/     → game/Client/
- Server/     → game/Server/  
- Database/   → game/Database/
```

### Bước 2: Chạy Test Script

**Mở Terminal và chạy:**

```bash
# Di chuyển đến thư mục game
cd "/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game"

# Chạy test script
chmod +x test_game.sh
./test_game.sh
```

### Bước 3: Test Unity Game

**Trong Unity Editor:**

1. **Mở Unity Hub**
2. **Add Project** → Chọn: `/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game/Client`
3. **Open Project**
4. **Mở scene**: `Assets/Scenes/Start.unity`
5. **Nhấn Play** (▶️)

### Bước 4: Kiểm tra kết nối

**Kết quả mong đợi:**
- ✅ Server chạy trên port 5555
- ✅ Unity client kết nối thành công
- ✅ Có thể tạo tài khoản mới
- ✅ Có thể xây dựng base

## 🎯 Test Cases

### ✅ Server Test
```bash
# Kiểm tra server
curl http://localhost:5555
# Hoặc
netstat -an | grep 5555
```

### ✅ Database Test
```bash
# Kiểm tra MySQL
mysql -u root -e "SHOW DATABASES;"
mysql -u root -e "USE clash_of_whatever; SHOW TABLES;"
```

### ✅ Unity Test
- Mở Unity project
- Nhấn Play
- Kiểm tra Console (không có lỗi)
- Test game features

## 🔧 Nếu gặp lỗi

**Server không chạy:**
```bash
# Cài .NET
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --version 7.0.404
export PATH="$PATH:/Users/doandothanhdanh/.dotnet"
```

**Unity không mở:**
- Thử Unity 2022.3 LTS thay vì 2023.2.1f1
- Kiểm tra Unity version compatibility

**Database lỗi:**
```bash
# Reset MySQL
brew services restart mysql
mysql -u root -e "CREATE DATABASE clash_of_whatever;"
```

## 🎮 Game Features để Test

1. **Player Registration** - Tạo tài khoản mới
2. **Base Building** - Xây dựng tòa nhà
3. **Resource Collection** - Thu thập tài nguyên
4. **Unit Training** - Huấn luyện quân đội
5. **Battle System** - Tấn công đối thủ
6. **Chat System** - Chat với người chơi khác
7. **Clan System** - Tạo/join clan

## ✅ Success Criteria

Game test thành công khi:
- ✅ Server chạy ổn định
- ✅ Unity client kết nối được
- ✅ Database hoạt động
- ✅ Có thể chơi game cơ bản
- ✅ Không có lỗi critical

**Sẵn sàng cho blockchain và streaming integration!** 🚀
