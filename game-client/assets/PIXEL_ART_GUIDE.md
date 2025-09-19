# 🎨 Atrax World - Hướng Dẫn Pixel Art & Animation

## 📐 **Đặc Tả Assets**

### **Sprite Nhân Vật (32x48 pixel)**
- **Kích Thước Cơ Bản**: 32x48 pixel (tỷ lệ 2:3)
- **Hướng**: 4 (lên, xuống, trái, phải)
- **Animation**: idle, walk, attack/shoot/charge
- **Số Frame**: 2-4 frame mỗi animation
- **Tổng Frame**: 8-16 frame mỗi nhân vật

### **Sprite Tòa Nhà (64x64 pixel)**
- **Kích Thước Cơ Bản**: 64x64 pixel (2x2 tiles)
- **Cấp Nâng Cấp**: 1-5 cấp mỗi loại tòa nhà
- **Animation**: Chỉ cối xay gió (cánh quạt quay)
- **Số Frame**: 4-8 frame cho cối xay gió

### **Sprite Tile (32x32 pixel)**
- **Kích Thước Cơ Bản**: 32x32 pixel (1x1 tile)
- **Animation**: Nước, bụi cỏ lăn, vây cá mập
- **Số Frame**: 4-8 frame mỗi animation

### **Sprite Vật Phẩm (24x24 pixel)**
- **Kích Thước Cơ Bản**: 24x24 pixel
- **Không Animation**: Chỉ vật phẩm tĩnh

## 🎯 **Hướng Dẫn Animation**

### **Animation Nhân Vật**
```
Bố Cục Frame (32x48 mỗi frame):
┌─────────────────┐
│   Đầu (8x8)     │
├─────────────────┤
│   Thân (16x16)  │
├─────────────────┤
│   Chân (16x16)  │
└─────────────────┘

Chuỗi Animation:
- Idle: 2 frame (thở nhẹ)
- Walk: 4 frame (chân trái, cả hai chân, chân phải, cả hai chân)
- Attack: 3 frame (vung, đánh, thu về)
```

### **Animation Tòa Nhà**
```
Bố Cục Cối Xay Gió (64x64):
┌─────────────────────────────────┐
│        Cánh Quạt Quay           │
│    (4-8 frame, xoay 45°)        │
├─────────────────────────────────┤
│         Thân Tòa Nhà            │
│         (Tĩnh)                  │
└─────────────────────────────────┘
```

### **Animation Tile**
```
Animation Nước (32x32):
Frame 1: ┌────┐  Frame 2: ┌────┐
         │~~~~│           │~^~│
         │^~^│           │~^~│
         └────┘           └────┘

Frame 3: ┌────┐  Frame 4: ┌────┐
         │~^~│           │~~~~│
         │^~^│           │~^~│
         └────┘           └────┘
```

## 🎨 **Hướng Dẫn Bảng Màu**

### **Làng Đồng Bằng**
- **Chính**: #4CAF50 (Xanh Lá)
- **Phụ**: #8BC34A (Xanh Lá Nhạt)
- **Nhấn**: #FFEB3B (Vàng)
- **Tối**: #2E7D32 (Xanh Lá Đậm)

### **Làng Sa Mạc**
- **Chính**: #FFC107 (Hổ Phách)
- **Phụ**: #FF9800 (Cam)
- **Nhấn**: #FF5722 (Cam Đậm)
- **Tối**: #E65100 (Cam Tối)

### **Làng Đảo**
- **Chính**: #2196F3 (Xanh Dương)
- **Phụ**: #03DAC6 (Xanh Ngọc)
- **Nhấn**: #FF4081 (Hồng)
- **Tối**: #0D47A1 (Xanh Dương Đậm)

### **Làng Tuyết**
- **Chính**: #E3F2FD (Xanh Dương Nhạt)
- **Phụ**: #BBDEFB (Xanh Xám)
- **Nhấn**: #FFCDD2 (Hồng Nhạt)
- **Tối**: #1976D2 (Xanh Dương)

## 🛠️ **Triển Khai Animation**

### **Bố Cục Sprite Sheet**
```
Sprite Sheet Nhân Vật (128x192):
┌─────────┬─────────┐
│ Idle    │ Walk    │
│ (2x4)   │ (4x4)   │
├─────────┼─────────┤
│ Attack  │ Special │
│ (3x4)   │ (1x4)   │
└─────────┴─────────┘
```

### **Cấu Trúc Code Animation**
```javascript
// Animation Nhân Vật
const characterAnimations = {
    idle: { frames: 2, duration: 1000 },
    walk: { frames: 4, duration: 600 },
    attack: { frames: 3, duration: 800 }
};

// Animation Tòa Nhà
const buildingAnimations = {
    windmill: { frames: 8, duration: 2000 }
};

// Animation Tile
const tileAnimations = {
    water: { frames: 4, duration: 1000 },
    tumbleweed: { frames: 6, duration: 1500 },
    sharkFin: { frames: 4, duration: 800 }
};
```

## 📋 **Danh Sách Kiểm Tra Assets**

### **Nhân Vật (11 tổng cộng)**
- [ ] Dân Thường Nam Đồng Bằng (32x48, 4 hướng, 3 animation)
- [ ] Dân Thường Nữ Đồng Bằng (32x48, 4 hướng, 3 animation)
- [ ] Dân Thường Nam Sa Mạc (32x48, 4 hướng, 3 animation)
- [ ] Dân Thường Nữ Sa Mạc (32x48, 4 hướng, 3 animation)
- [ ] Dân Thường Nam Đảo (32x48, 4 hướng, 3 animation)
- [ ] Dân Thường Nữ Đảo (32x48, 4 hướng, 3 animation)
- [ ] Dân Thường Nam Tuyết (32x48, 4 hướng, 3 animation)
- [ ] Dân Thường Nữ Tuyết (32x48, 4 hướng, 3 animation)
- [ ] Lính Cận Chiến (32x48, 4 hướng, 3 animation)
- [ ] Lính Bắn Cung (32x48, 4 hướng, 3 animation)
- [ ] Lính Cưỡi Ngựa (32x48, 4 hướng, 3 animation)

### **Tòa Nhà (25 tổng cộng)**
- [ ] Nhà Cấp 1-5 (64x64 mỗi cái)
- [ ] Nhà Nông Trại Cấp 1-3 (64x64 mỗi cái)
- [ ] Tòa Thành Cấp 1-5 (64x64 mỗi cái)
- [ ] Cối Xay Gió (64x64, có animation)
- [ ] Chuồng Heo Cấp 1-3 (64x64 mỗi cái)
- [ ] Chuồng Ngựa Cấp 1-3 (64x64 mỗi cái)

### **Phần Tử Nông Trại (11 tổng cộng)**
- [ ] Đất Ruộng Nhỏ (32x32)
- [ ] Đất Ruộng 2x1 (64x32)
- [ ] Đất Ruộng 2x2 (64x64)
- [ ] Đất Ruộng 2x3 (64x96)
- [ ] Hàng Rào (32x32)
- [ ] Cây Lúa Xanh (32x32)
- [ ] Cây Lúa Sắp Chín (32x32)
- [ ] Cây Lúa Chín (32x32)
- [ ] Cây Ngô Không Quả (32x32)
- [ ] Cây Ngô Có Quả (32x32)
- [ ] Bắp Ngô (24x24)

### **Động Vật (6 tổng cộng)**
- [ ] Cừu Đen (32x32, có animation)
- [ ] Cừu Trắng (32x32, có animation)
- [ ] Lạc Đà (32x32, có animation)
- [ ] Gấu Bắc Cực Lớn (32x32, có animation)
- [ ] Gấu Bắc Cực Con (24x24, có animation)
- [ ] Vây Cá Mập (32x32, có animation)

### **Địa Hình (8 tổng cộng)**
- [ ] Cây Đồng Bằng (32x32)
- [ ] Bụi Cây Đồng Bằng (32x32)
- [ ] Hoa Đồng Bằng (16x16)
- [ ] Xương Rồng (32x32)
- [ ] Xương Rồng Có Hoa (32x32)
- [ ] Bụi Cỏ Lăn (32x32, có animation)
- [ ] Cây Thông (32x32)
- [ ] Animation Nước (32x32, có animation)

## 🎨 **Mẹo Thiết Kế**

1. **Pixel Perfect**: Sử dụng brush 1x1 pixel, không anti-aliasing
2. **Phong Cách Nhất Quán**: Duy trì cùng phong cách nghệ thuật cho tất cả assets
3. **Hài Hòa Màu Sắc**: Sử dụng bảng màu được cung cấp
4. **Luồng Animation**: Đảm bảo chuyển tiếp mượt mà giữa các frame
5. **Khả Năng Đọc**: Đảm bảo sprite rõ ràng ở độ phân giải game
6. **Độ Trong Suốt**: Sử dụng định dạng PNG với kênh alpha phù hợp
7. **Tối Ưu Hóa**: Giữ kích thước file hợp lý để tải web

## 🔧 **Cài Đặt Xuất**

- **Định Dạng**: PNG
- **Chế Độ Màu**: RGB
- **Độ Trong Suốt**: Bật
- **Nén**: Không (cho pixel art)
- **Dithering**: Không
- **Anti-aliasing**: Không

## 📱 **Kiểm Tra**

Sau khi tạo assets:
1. Kiểm tra trong game ở độ phân giải thực tế
2. Kiểm tra độ mượt của animation
3. Xác minh tính nhất quán màu sắc
4. Đảm bảo độ trong suốt phù hợp
5. Kiểm tra hiệu suất tải

Chúc bạn tạo pixel art vui vẻ! 🎨✨
