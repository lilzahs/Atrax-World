# 🎵 Atrax World - Hướng Dẫn Âm Thanh

## 📁 Cấu Trúc Thư Mục Âm Thanh

Thư mục này chứa tất cả các tài nguyên âm thanh cho game Atrax World. Mỗi file placeholder đều bao gồm đặc tả âm thanh và khuyến nghị.

## 🎵 Hướng Dẫn Âm Thanh

### **Hiệu Ứng Âm Thanh (SFX)**
- **Định dạng**: MP3 hoặc OGG
- **Chất lượng**: 44.1kHz, 16-bit
- **Độ dài**: 0.1-1.0 giây
- **Âm lượng**: Mức trung bình

### **Nhạc Nền (Music)**
- **Định dạng**: MP3 hoặc OGG
- **Chất lượng**: 44.1kHz, 16-bit
- **Độ dài**: 1-5 phút (có thể lặp)
- **Âm lượng**: Mức thấp (nhạc nền)

## 🎯 Danh Sách Âm Thanh Cần Thiết

### **Hiệu Ứng UI**
- [ ] `button-click.mp3` - Âm thanh click nút (0.1-0.3s)
- [ ] `button-hover.mp3` - Âm thanh hover nút (0.1-0.2s)
- [ ] `notification.mp3` - Âm thanh thông báo (0.5-1.0s)
- [ ] `error.mp3` - Âm thanh lỗi (0.3-0.6s)
- [ ] `success.mp3` - Âm thanh thành công (0.4-0.8s)

### **Hiệu Ứng Game**
- [ ] `player-walk.mp3` - Âm thanh đi bộ (0.2-0.5s, có thể lặp)
- [ ] `building-place.mp3` - Âm thanh đặt tòa nhà (0.3-0.8s)
- [ ] `building-upgrade.mp3` - Âm thanh nâng cấp tòa nhà (0.5-1.0s)
- [ ] `item-pickup.mp3` - Âm thanh nhặt vật phẩm (0.2-0.4s)
- [ ] `item-drop.mp3` - Âm thanh thả vật phẩm (0.2-0.4s)
- [ ] `coin-collect.mp3` - Âm thanh thu thập coin (0.3-0.6s)

### **Nhạc Nền Theo Biome**
- [ ] `plains-theme.mp3` - Nhạc nền làng đồng bằng (2-5 phút)
- [ ] `desert-theme.mp3` - Nhạc nền làng sa mạc (2-5 phút)
- [ ] `island-theme.mp3` - Nhạc nền làng đảo (2-5 phút)
- [ ] `snow-theme.mp3` - Nhạc nền làng tuyết (2-5 phút)

### **Nhạc Nền Đặc Biệt**
- [ ] `main-menu.mp3` - Nhạc nền menu chính (1-3 phút)
- [ ] `shop-theme.mp3` - Nhạc nền cửa hàng (1-2 phút)

## 🎨 Hướng Dẫn Thiết Kế Âm Thanh

### **Phong Cách Âm Thanh**
- **Pixel Art Style**: Âm thanh retro, 8-bit
- **Hài Hòa**: Phù hợp với phong cách game
- **Chất Lượng**: Rõ ràng, không bị méo
- **Tương Thích**: Hoạt động trên mọi trình duyệt

### **Mẹo Tạo Âm Thanh**
1. **Sử dụng công cụ**: Audacity, FL Studio, GarageBand
2. **Tham khảo**: Game pixel art khác
3. **Test trên web**: Kiểm tra tải và phát
4. **Tối ưu hóa**: Nén file để tải nhanh
5. **Backup**: Lưu file gốc chất lượng cao

## 🛠️ Cách Thay Thế Âm Thanh

1. **Tạo âm thanh** sử dụng công cụ ưa thích
2. **Xuất dưới dạng MP3/OGG** với chất lượng phù hợp
3. **Thay thế file placeholder** bằng âm thanh thật
4. **Test trong game** để đảm bảo hoạt động đúng
5. **Điều chỉnh âm lượng** nếu cần

## 🔊 Tích Hợp Code

AudioManager đã được tích hợp sẵn vào game:

```javascript
// Phát hiệu ứng âm thanh
this.audioManager.playButtonClick();
this.audioManager.playPlayerWalk();
this.audioManager.playBuildingPlace();

// Phát nhạc nền
this.audioManager.playBiomeMusic('plains');
this.audioManager.playMusic('main-menu');

// Điều khiển âm lượng
this.audioManager.setMasterVolume(0.8);
this.audioManager.setSfxVolume(0.7);
this.audioManager.setMusicVolume(0.3);

// Tắt/bật âm thanh
this.audioManager.toggleMute();
```

## 📋 Checklist Hoàn Thành

### **Hiệu Ứng UI (5 files)**
- [ ] Button click sound
- [ ] Button hover sound
- [ ] Notification sound
- [ ] Error sound
- [ ] Success sound

### **Hiệu Ứng Game (6 files)**
- [ ] Player walk sound
- [ ] Building place sound
- [ ] Building upgrade sound
- [ ] Item pickup sound
- [ ] Item drop sound
- [ ] Coin collect sound

### **Nhạc Nền (6 files)**
- [ ] Plains theme music
- [ ] Desert theme music
- [ ] Island theme music
- [ ] Snow theme music
- [ ] Main menu music
- [ ] Shop theme music

## 🎯 Mẹo Tối Ưu

1. **File Size**: Giữ kích thước file nhỏ để tải nhanh
2. **Format**: Sử dụng MP3 cho tương thích tốt nhất
3. **Loop**: Đảm bảo nhạc nền lặp mượt mà
4. **Volume**: Cân bằng âm lượng giữa các file
5. **Testing**: Test trên nhiều thiết bị khác nhau

Chúc bạn tạo âm thanh vui vẻ! 🎵✨
