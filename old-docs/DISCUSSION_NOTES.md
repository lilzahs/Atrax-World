Lưu Ý Thảo Luận

1) Phân Quyền / Authority
- Vai trò hiện tại: Admin (cấu hình) vs Dev wallet (nhận tiền) — mức tách biệt đã đủ chưa?
- Quy trình xoay vòng quyền: đổi admin, đổi dev wallet — yêu cầu xác thực/kiểm soát nào?
- Phân biệt Admin on-chain (trong Config) và Upgrade Authority của program — quản lý thế nào?
- Có cần cơ chế tạm dừng (pause) một số chức năng (donate/buy/trade) khi sự cố?
- Có cần thêm các vai trò khác (ví dụ: operator/treasurer/pauser) hay giữ mô hình tối giản?

2) Treasury / Dev Wallet
- Dòng tiền của từng instruction: donate, trade_item (fee), buy_item (100% vào dev) — có cần thay đổi tỉ lệ?
- Cách hiển thị/đối soát nguồn thu (minh bạch, auditing) — yêu cầu tối thiểu?
- Dev wallet là ví hệ thống hay vault (PDA) — tiêu chí lựa chọn?

3) Items (Cách lưu on-chain)
- Mô hình biểu diễn item: PDA-based vs SPL fungible (decimals=0) vs NFT/cNFT — tiêu chí chọn cho giai đoạn demo và dài hạn?
- Loại item: stackable vs unique — ảnh hưởng đến mô hình lưu trữ/trao đổi?
- Giá item: lưu on-chain (ItemConfig) hay off-chain — mức độ linh hoạt cần có?
- Trade rules: giới hạn, chống gian lận, kiểm soát nguồn cung — yêu cầu ra sao?

4) Land (Thiết kế PDA)
- Seed hiện tại dùng owner → sau khi transfer, PDA không khớp với owner mới — có cần seed ổn định theo land_id?
- Vòng đời land: khởi tạo, chuyển nhượng, thu hồi — quy tắc/điều kiện cần rõ?
- Nếu đổi schema: có cần kế hoạch migrate hay chấp nhận reset (nếu còn sớm)?

5) Frontend / IDL / Triển khai
- Nguồn IDL chuẩn: ưu tiên on-chain; quy trình đồng bộ IDL vào FE — cần chuẩn hoá?
- Program ID thống nhất (một nguồn chân lý) — ghi nhận ở đâu (IDL/Anchor.toml/docs)?
- Thứ tự build/deploy/copy IDL để tránh mismatch — cần ghi rõ checklist?

6) Sự Kiện & Theo Dõi (Observability)
- Chuẩn hoá event fields để index/hiển thị (donations, trades, purchases, land transfers)?
- Cần logging/analytics tối thiểu nào cho QA/demo?

7) UX & Quy Tắc Hiển Thị
- Gating theo quyền: form/admin-only — phạm vi những gì cần ẩn/khóa?
- Thông báo lỗi/tx-link/explorer — mức độ chi tiết cần thiết trong demo?

8) Bảo Mật & Quy Trình
- Quản lý khoá: admin/upgrade authority/dev wallet — ai giữ, cách lưu trữ?
- Có cần quy trình review/approval khi đổi các tham số nhạy cảm (fee_bps, dev_wallet, admin)?

Ghi chú: Tài liệu này chỉ nêu vấn đề để thảo luận. Giải pháp cụ thể sẽ cập nhật sau khi thống nhất với team.

