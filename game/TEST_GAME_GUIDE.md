# 🎮 Test Game Guide - Atrax-World

## Bước 1: Copy Game Assets (Thực hiện thủ công)

**Mở Finder và thực hiện:**

1. **Mở 2 cửa sổ Finder:**
   - Cửa sổ 1: `/Users/doandothanhdanh/Desktop/zah project/clash-of-clans-clone/`
   - Cửa sổ 2: `/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game/`

2. **Copy các thư mục:**
   - Kéo thả `Client` từ cửa sổ 1 vào cửa sổ 2
   - Kéo thả `Server` từ cửa sổ 1 vào cửa sổ 2  
   - Kéo thả `Database` từ cửa sổ 1 vào cửa sổ 2

3. **Copy files:**
   - Copy `README.md` → `README_original.md`
   - Copy `LICENSE` (nếu có)

## Bước 2: Test Game Server

**Mở Terminal và chạy:**

```bash
# 1. Di chuyển đến thư mục Server
cd "/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game/Server"

# 2. Kiểm tra .NET
export PATH="$PATH:/Users/doandothanhdanh/.dotnet"
dotnet --version

# 3. Restore packages
dotnet restore

# 4. Build project
dotnet build

# 5. Chạy server
dotnet run
```

**Kết quả mong đợi:**
```
Server started on port 5555
Online Players: 0
```

## Bước 3: Test Unity Game

**Mở Unity Editor:**

1. **Mở Unity Hub**
2. **Add Project** → Chọn thư mục:
   ```
   /Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game/Client
   ```
3. **Chọn Unity version**: 2023.2.1f1 hoặc 2022.3 LTS
4. **Open Project**

**Trong Unity Editor:**

1. **Mở scene**: `Assets/Scenes/Start.unity`
2. **Nhấn Play** (▶️)
3. **Kiểm tra kết nối**: Game sẽ kết nối với server localhost:5555

## Bước 4: Test Database

**Mở Terminal và chạy:**

```bash
# 1. Kiểm tra MySQL
brew services list | grep mysql

# 2. Nếu MySQL chưa chạy
brew services start mysql

# 3. Tạo database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS clash_of_whatever;"

# 4. Import schema
mysql -u root clash_of_whatever < "/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game/Database/database.sql"

# 5. Kiểm tra tables
mysql -u root -e "SHOW TABLES;" clash_of_whatever
```

## Bước 5: Test Full Integration

**Chạy tất cả cùng lúc:**

1. **Terminal 1 - Game Server:**
   ```bash
   cd "/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game/Server"
   export PATH="$PATH:/Users/doandothanhdanh/.dotnet"
   dotnet run
   ```

2. **Terminal 2 - MySQL:**
   ```bash
   brew services start mysql
   ```

3. **Unity Editor - Game Client:**
   - Mở project trong Unity
   - Nhấn Play
   - Test game features

## 🎯 Test Cases

### Test 1: Server Connection
- ✅ Server starts on port 5555
- ✅ Unity client connects successfully
- ✅ No connection errors

### Test 2: Database Connection
- ✅ MySQL running
- ✅ Database created
- ✅ Tables imported
- ✅ Server can connect to database

### Test 3: Game Features
- ✅ Player registration/login
- ✅ Base building
- ✅ Resource collection
- ✅ Unit training
- ✅ Battle system

### Test 4: Multiplayer
- ✅ Multiple players can connect
- ✅ Real-time synchronization
- ✅ Chat system
- ✅ Clan features

## 🔧 Troubleshooting

**Nếu server không chạy:**
```bash
# Kiểm tra .NET
dotnet --version

# Cài đặt .NET nếu cần
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --version 7.0.404
export PATH="$PATH:/Users/doandothanhdanh/.dotnet"
```

**Nếu Unity không mở:**
- Kiểm tra Unity version compatibility
- Thử Unity 2022.3 LTS thay vì 2023.2.1f1

**Nếu database lỗi:**
```bash
# Reset MySQL
brew services stop mysql
brew services start mysql
mysql -u root -e "DROP DATABASE IF EXISTS clash_of_whatever;"
mysql -u root -e "CREATE DATABASE clash_of_whatever;"
```

## ✅ Success Criteria

Game test thành công khi:
- ✅ Server chạy ổn định
- ✅ Unity client kết nối được
- ✅ Database hoạt động
- ✅ Có thể tạo tài khoản mới
- ✅ Có thể xây dựng base
- ✅ Có thể train units
- ✅ Có thể battle

**Sẵn sàng để tích hợp blockchain và streaming!** 🚀
