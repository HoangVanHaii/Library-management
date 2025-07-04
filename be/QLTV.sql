CREATE DATABASE LibraryDB
GO
USE LibraryDB
GO

CREATE TABLE BOOKS (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NAMEBOOK NVARCHAR(100) NOT NULL,
    AUTHOR NVARCHAR(100),
    CATEGORY NVARCHAR(50),
    COVER_IMAGE NVARCHAR(255),
    DETAIL NVARCHAR(400),
    QUANTITY INT,
    SELL_PRICE DECIMAL(10,2),
    BORRW_PRICE DECIMAL(10,2),
    IS_FLASHSALE BIT DEFAULT 0,
    FLASH_PRICE INT, 
    FLASH_QUANTITY INT,
    FLASH_START DATETIME,
    FLASH_END DATETIME,
    COVER_IMAGE NVARCHAR(250),
    FINE_PER_DAY DECIMAL(10, 2)
);
UPDATE BOOKS SET FINE_PER_DAY = 2000
GO
CREATE TABLE USERS (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NAMEUSER NVARCHAR(100) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL,
    USERNAME VARCHAR(255) UNIQUE,
    PASSWORD VARCHAR(255), 
    ROLE VARCHAR(50) DEFAULT 'USER',
    COVER_IMAGE NVARCHAR(255),
    ADDRESS NVARCHAR(255)
);
GO
CREATE TABLE BORROW (
    ID INT PRIMARY KEY IDENTITY(1,1),
    USER_ID INT NOT NULL,
    BORROW_DATE DATE DEFAULT GETDATE(),
    DUE_DATE DATE NOT NULL,
    RETURN_DATE DATE,
    STATUS NVARCHAR(20) DEFAULT N'Đang mượn',
    TOTAL_FEE DECIMAL(10,2) DEFAULT 0,

    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);
ALTER TABLE BORROW ADD FINE_TOTAL DECIMAL(10,2) DEFAULT 0.00
GO
CREATE TABLE BORROW_DETAILS (
    ID INT PRIMARY KEY IDENTITY(1,1),
    BORROW_ID INT NOT NULL,
    BOOK_ID INT NOT NULL,
    QUANTITY INT NOT NULL DEFAULT 1,
    BOOK_FEE DECIMAL(10,2) DEFAULT 0,
    FINE DECIMAL(10,2) DEFAULT 0,

    FOREIGN KEY (BORROW_ID) REFERENCES BORROW(ID),
    FOREIGN KEY (BOOK_ID) REFERENCES BOOKS(ID)
);

CREATE TABLE REFRESH_TOKEN(
    ID INT IDENTITY PRIMARY KEY,
    TOKEN NVARCHAR(MAX),
    USER_ID INT ,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
)
GO
CREATE TABLE ORDERS(
    ID INT PRIMARY KEY IDENTITY(1,1),
    USER_ID INT NOT NULL,
    BOOK_ID INT NOT NULL,
    QUANTITY INT NOT NULL,
    ORDER_DATE DATE DEFAULT GETDATE(),
    STATUS BIT DEFAULT 0,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (BOOK_ID) REFERENCES BOOKS(ID),
    TOTAL_PRICE DECIMAL(10, 2)
)

GO
CREATE TABLE CART(
    ID INT PRIMARY KEY IDENTITY(1,1),
    USER_ID INT NOT NULL,
    BOOK_ID INT NOT NULL,
    QUANTITY INT NOT NULL,
    CART_DATE DATE DEFAULT GETDATE(),
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY (BOOK_ID) REFERENCES BOOKS(ID)
)
-- SELECT *FROM USERS 
-- SELECT *FROM REFRESH_TOKEN
-- SELECT *FROM BORROW
SELECT *FROM BORROW_DETAILS
UPDATE BOOKS SET QUANTITY = 10 WHERE QUANTITY = 0
SELECT *FROM ORDERS WHERE BOOK_ID = 1069
UPDATE BOOKS SET BORROW_PRICE = BORROW_PRICE + 12000
UPDATE BOOKS
SET
    IS_FLASHSALE = 1,
    FLASH_PRICE = 52000,
    FLASH_QUANTITY = 10,
    FLASH_START = '2025-06-27 12:00:00',
    FLASH_END = '2025-06-27 14:00:00'
WHERE ID = 1068;

UPDATE BOOKS
SET
    IS_FLASHSALE = 1,
    FLASH_PRICE = 66500,
    FLASH_QUANTITY = 8,
    FLASH_START = '2025-06-27 12:00:00',
    FLASH_END = '2025-06-27 14:00:00'
WHERE ID = 1069;

-- ID 1070 – Giảm 25%
UPDATE BOOKS
SET
    IS_FLASHSALE = 1,
    FLASH_PRICE = 66750,
    FLASH_QUANTITY = 9,
    FLASH_START = '2025-06-27 12:00:00',
    FLASH_END = '2025-06-27 14:00:00'
WHERE ID = 1070;

-- ID 1071 – Giảm 15%
UPDATE BOOKS
SET
    IS_FLASHSALE = 1,
    FLASH_PRICE = 63750,
    FLASH_QUANTITY = 7,
    FLASH_START = '2025-06-27 12:00:00',
    FLASH_END = '2025-06-27 14:00:00'
WHERE ID = 1071;

-- ID 1072 – Giảm 35%
UPDATE BOOKS
SET
    IS_FLASHSALE = 1,
    FLASH_PRICE = 63700,
    FLASH_QUANTITY = 6,
    FLASH_START = '2025-06-27 12:00:00',
    FLASH_END = '2025-06-27 14:00:00'
WHERE ID = 1072;

INSERT INTO BOOKS (
    NAMEBOOK,
    AUTHOR,
    CATEGORY,
    COVER_IMAGE,
    DETAIL,
    QUANTITY,
    SELL_PRICE,
    BORROW_PRICE,
    IS_FLASHSALE,
    FLASH_PRICE,
    FLASH_QUANTITY,
    FLASH_START,
    FLASH_END
)
VALUES (
    N'Tiếng Anh 10',
    N'Nhiều tác giả (NXB Giáo dục Việt Nam, Pearson)',
    N'Sách giáo khoa',
    N'/upload/book/ip.jpg', -- bạn đổi đúng đường dẫn hình nhé
    N'Sách Tiếng Anh lớp 10 theo chương trình mới của Bộ GD&ĐT, phát triển theo hướng năng lực giao tiếp, chú trọng 4 kỹ năng nghe, nói, đọc, viết. Nội dung hiện đại, có tính quốc tế, do NXB Giáo Dục và Pearson hợp tác phát hành.',
    100,              -- số lượng trong kho
    39000.00,         -- giá bán
    5000.00,          -- giá mượn
    1,                -- có flash sale
    29000,            -- giá flash sale
    20,               -- số lượng flash sale
    '2025-06-28 09:00:00',  -- thời gian bắt đầu flash sale
    '2025-06-30 23:59:59'   -- thời gian kết thúc
);
INSERT INTO BOOKS (
    NAMEBOOK,
    AUTHOR,
    CATEGORY,
    COVER_IMAGE,
    DETAIL,
    QUANTITY,
    SELL_PRICE,
    BORROW_PRICE,
    IS_FLASHSALE,
    FLASH_PRICE,
    FLASH_QUANTITY,
    FLASH_START,
    FLASH_END
)
VALUES
-- 1. Tiếng Anh 10
(
    N'Tiếng Anh 10',
    N'Nhiều tác giả (NXB Giáo dục Việt Nam, Pearson)',
    N'Sách giáo khoa',
    N'/upload/book/tienganh10.jpg',
    N'Sách Tiếng Anh lớp 10 theo chương trình mới của Bộ GD&ĐT, phát triển theo hướng năng lực giao tiếp, chú trọng 4 kỹ năng nghe, nói, đọc, viết. Nội dung hiện đại, có tính quốc tế, do NXB Giáo Dục và Pearson hợp tác phát hành.',
    100,
    39000.00,
    5000.00,
    1,
    29000,
    20,
    '2025-06-28 09:00:00',
    '2025-06-30 23:59:59'
),
-- 2. Bài Tập Tiếng Anh 6
(
    N'Bài Tập Tiếng Anh 6',
    N'Lighthouse Writers',
    N'Sách bài tập',
    N'/upload/book/tienganh6.jpg',
    N'Sách bài tập Tiếng Anh lớp 6 có đáp án, được biên soạn theo chương trình SGK Global Success. Nội dung đa dạng, bám sát kiến thức trọng tâm, giúp học sinh luyện tập cả 4 kỹ năng: nghe, nói, đọc, viết.',
    120,
    46000.00,
    6000.00,
    0,
    35000,
    30,
    '2025-07-01 08:00:00',
    '2025-07-03 23:59:59'
),
-- 3. Hướng Dẫn Học Tốt Tiếng Anh 7
(
    N'Hướng Dẫn Học Tốt Tiếng Anh 7',
    N'Mai Lan Hương, Hà Thanh Uyên',
    N'Sách tham khảo',
    N'/upload/book/tienganh7.jpg',
    N'Sách hướng dẫn học tốt Tiếng Anh lớp 7 - Global Success giúp học sinh hệ thống lại kiến thức, rèn luyện bài tập, tăng khả năng ghi nhớ và vận dụng ngôn ngữ trong thực tế học tập.',
    95,
    52000.00,
    7000.00,
    0,
    NULL,
    NULL,
    NULL,
    NULL
),
-- 4. Tiếng Anh 8
(
    N'Tiếng Anh 8',
    N'Nhiều tác giả (NXB Giáo dục Việt Nam)',
    N'Sách giáo khoa',
    N'/upload/book/tienganh8.jpg',
    N'Sách Tiếng Anh lớp 8 cung cấp kiến thức và kỹ năng ngôn ngữ cho học sinh THCS theo chương trình chuẩn của Bộ Giáo dục. Bao gồm các chủ đề thiết thực, hoạt động giao tiếp và luyện tập bám sát 4 kỹ năng cơ bản.',
    80,
    40000.00,
    5500.00,
    0,
    31000,
    15,
    '2025-07-02 09:00:00',
    '2025-07-04 23:59:59'
),
-- 5. Tiếng Anh 9
(
    N'Tiếng Anh 9',
    N'Nhiều tác giả (NXB Giáo dục Việt Nam)',
    N'Sách giáo khoa',
    N'/upload/book/tienganh9.jpg',
    N'Sách Tiếng Anh lớp 9 là bước chuẩn bị quan trọng cho học sinh trước khi lên THPT. Nội dung tiếp cận hiện đại, giúp học sinh rèn luyện toàn diện kỹ năng tiếng Anh với các chủ đề gần gũi, bài học sinh động.',
    90,
    42000.00,
    6000.00,
    0,
    NULL,
    NULL,
    NULL,
    NULL
);

INSERT INTO BOOKS (
    NAMEBOOK,
    AUTHOR,
    CATEGORY,
    COVER_IMAGE,
    DETAIL,
    QUANTITY,
    SELL_PRICE,
    BORROW_PRICE,
    IS_FLASHSALE,
    FLASH_PRICE,
    FLASH_QUANTITY,
    FLASH_START,
    FLASH_END
)
VALUES
-- Toán 12
(
    N'Toán 12',
    N'Bộ GD&ĐT',
    N'Sách giáo khoa',
    N'/upload/book/toan12.jpg',
    N'Sách giáo khoa Toán 12 cung cấp kiến thức giải tích và hình học hiện đại, giúp học sinh chuẩn bị cho kỳ thi tốt nghiệp và đại học.',
    100,
    48000.00,
    6000.00,
    0, NULL, NULL, NULL, NULL
),
-- Ngữ Văn 12
(
    N'Ngữ Văn 12',
    N'Bộ GD&ĐT',
    N'Sách giáo khoa',
    N'/upload/book/nguvan12.jpg',
    N'Sách giáo khoa Ngữ Văn 12 phát triển kỹ năng đọc hiểu, viết nghị luận và phân tích văn học, với nhiều tác phẩm kinh điển Việt Nam và thế giới.',
    100,
    52000.00,
    6000.00,
    0, NULL, NULL, NULL, NULL
),
-- Lịch Sử 12
(
    N'Lịch Sử 12',
    N'Bộ GD&ĐT',
    N'Sách giáo khoa',
    N'/upload/book/su12.jpg',
    N'Sách giáo khoa Lịch Sử 12 trình bày các sự kiện lịch sử Việt Nam và thế giới từ 1945 đến nay, giúp học sinh hiểu rõ tiến trình lịch sử hiện đại.',
    100,
    46000.00,
    5000.00,
    0, NULL, NULL, NULL, NULL
),
-- Địa Lý 12
(
    N'Địa Lý 12',
    N'Bộ GD&ĐT',
    N'Sách giáo khoa',
    N'/upload/book/diali12.jpg',
    N'Sách giáo khoa Địa Lý 12 tập trung vào địa lý kinh tế, xã hội Việt Nam và thế giới, phục vụ thi tốt nghiệp và đại học.',
    100,
    45000.00,
    5000.00,
    0, NULL, NULL, NULL, NULL
),
-- Hóa Học 12
(
    N'Hóa Học 12',
    N'Bộ GD&ĐT',
    N'Sách giáo khoa',
    N'/upload/book/hoa12.jpg',
    N'Sách giáo khoa Hóa Học 12 bao gồm các chuyên đề hóa hữu cơ và vô cơ, hỗ trợ luyện thi và nâng cao kỹ năng giải bài tập hóa học.',
    100,
    47000.00,
    6000.00,
    0, NULL, NULL, NULL, NULL
),
-- Sinh Học 12
(
    N'Sinh Học 12',
    N'Bộ GD&ĐT',
    N'Sách giáo khoa',
    N'/upload/book/sinh12.jpg',
    N'Sách giáo khoa Sinh Học 12 cung cấp kiến thức di truyền học, tiến hóa, sinh thái, là nội dung trọng tâm thi tốt nghiệp.',
    100,
    46000.00,
    5500.00,
    0, NULL, NULL, NULL, NULL
),
-- Vật Lý 12
(
    N'Vật Lý 12',
    N'Bộ GD&ĐT',
    N'Sách giáo khoa',
    N'/upload/book/vatli12.jpg',
    N'Sách giáo khoa Vật Lý 12 cung cấp các chuyên đề về điện xoay chiều, sóng điện từ, lượng tử ánh sáng, giúp học sinh ôn tập hiệu quả cho kỳ thi.',
    100,
    49000.00,
    6000.00,
    0, NULL, NULL, NULL, NULL
);
INSERT INTO BOOKS (
    NAMEBOOK,
    AUTHOR,
    CATEGORY,
    COVER_IMAGE,
    DETAIL,
    QUANTITY,
    SELL_PRICE,
    BORROW_PRICE,
    IS_FLASHSALE,
    FLASH_PRICE,
    FLASH_QUANTITY,
    FLASH_START,
    FLASH_END
)
 UPDATE BOOKS SET COVER_IMAGE = N'/upload/book/70nam.jpg' WHERE NAMEBOOK = N'Chuyện ở Đồi A1'


VALUES
-- Đất Nước Cẩm Hòa
(
    N'Đất Nước Cẩm Hòa',
    N'Võ Thị Mai Chi',
    N'Văn hóa – Địa lý',
    N'/upload/book/dat-nuoc-gam-hoa.jpg',
    N'Tác phẩm giới thiệu đất nước Việt Nam thông qua các hình ảnh minh họa sinh động, gần gũi với đời sống con người, ẩm thực, văn hóa, phong cảnh và di tích.',
    50,
    95000.00,
    8000.00,
    0, NULL, NULL, NULL, NULL
),
-- Chuyện ở Đồi A1
(
    N'Chuyện ở Đồi A1',
    N'Nguyễn Tấn',
    N'Lịch sử – Ký sự',
    N'/upload/book/60nam.jpg',
    N'Tác phẩm kể lại trận đánh lịch sử tại đồi A1 trong chiến dịch Điện Biên Phủ 1954, với lời kể chân thực, xúc động, phù hợp học sinh và người yêu lịch sử.',
    60,
    58000.00,
    7000.00,
    0, NULL, NULL, NULL, NULL
),
-- Đại Việt Sử Ký Toàn Thư
(
    N'Đại Việt Sử Ký Toàn Thư',
    N'Nhiều tác giả – Ngô Sĩ Liên biên soạn',
    N'Lịch sử – Cổ sử',
    N'/upload/book/dai-viet-su-ki.jpg',
    N'Tác phẩm sử học kinh điển ghi chép toàn bộ quá trình lịch sử dân tộc từ thời Hồng Bàng đến nhà Hậu Lê, là tài liệu quý cho học sinh và người nghiên cứu sử học.',
    40,
    120000.00,
    10000.00,
    0, NULL, NULL, NULL, NULL
);

