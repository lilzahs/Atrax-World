# 🎮 Game Integration Guide

## Hướng dẫn tích hợp game vào Atrax-World

### Bước 1: Copy Game Assets

**Thực hiện các lệnh sau trong Terminal:**

```bash
# Di chuyển đến thư mục dự án
cd "/Users/doandothanhdanh/Desktop/zah project"

# Copy Unity Client
cp -r "clash-of-clans-clone/Client" "cs/Atrax-World/game/"

# Copy Game Server
cp -r "clash-of-clans-clone/Server" "cs/Atrax-World/game/"

# Copy Database
cp -r "clash-of-clans-clone/Database" "cs/Atrax-World/game/"

# Copy documentation
cp "clash-of-clans-clone/README.md" "cs/Atrax-World/game/README_original.md"
cp "clash-of-clans-clone/LICENSE" "cs/Atrax-World/game/"
```

### Bước 2: Clean Git History

```bash
# Xóa Git history từ copied files
cd "cs/Atrax-World/game"
find . -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".gitignore" -delete 2>/dev/null || true
```

### Bước 3: Git Operations

```bash
# Di chuyển đến Atrax-World root
cd "/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World"

# Add all files
git add .

# Commit changes
git commit -m "Add Unity game assets from Clash of Clans clone

- Added Unity Client with complete game assets
- Added .NET Server for multiplayer
- Added MySQL database schema
- Updated .gitignore for Unity files
- Ready for blockchain and streaming integration"

# Push to repository
git push
```

### Bước 4: Verify Integration

```bash
# Kiểm tra cấu trúc
ls -la game/
# Should show: Client/, Server/, Database/, README.md, LICENSE

# Kiểm tra Git status
git status
# Should show: "nothing to commit, working tree clean"
```

## 🏗️ Cấu trúc dự án sau khi tích hợp

```
Atrax-World/
├── atrax-world/
│   ├── App/                 # Next.js frontend
│   ├── backend/             # Node.js backend
│   └── smartcontract/       # Solana smart contracts
├── game/                    # 🆕 Unity Game
│   ├── Client/              # Unity game client
│   ├── Server/              # .NET game server
│   ├── Database/            # MySQL schema
│   └── README.md
└── .gitignore               # Updated for Unity
```

## 🚀 Next Steps

1. **Test Unity Game**: Mở `game/Client/` trong Unity
2. **Run Game Server**: Chạy server từ `game/Server/`
3. **Setup Database**: Import MySQL schema
4. **Blockchain Integration**: Kết nối với Solana smart contracts
5. **Streaming Integration**: Tích hợp với streaming platform

## 🔧 Troubleshooting

**Nếu gặp lỗi Git:**
```bash
# Reset và thử lại
git reset --hard HEAD
git clean -fd
git add .
git commit -m "Add game assets"
git push
```

**Nếu file quá lớn:**
```bash
# Cài Git LFS
brew install git-lfs
git lfs install
git lfs track "*.png"
git lfs track "*.jpg"
git lfs track "*.mp3"
git add .gitattributes
git commit -m "Configure Git LFS"
git push
```
