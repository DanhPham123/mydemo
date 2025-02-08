// Khai báo kết nối socket
var socket = io('http://localhost:3000');

// Khai báo timer quét để gửi yêu cầu dữ liệu
var myVar = setInterval(myTimer, 100);
function myTimer() {
    socket.emit("Client-send-data", "Request data client");
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.querySelector(".switch.demo3 input");
    const labelAuto = document.querySelector(".label-auto");
    const labelManual = document.querySelector(".label-manual");
    const dialog = document.getElementById("dialog");
    const dialogInput = document.getElementById("dialog-input");
    const btnNhapHang = document.getElementById("btnNhapHang");
    const btnXuatHang = document.getElementById("btnXuatHang");
    const btnXacNhan = document.getElementById("btnXacNhan");
    const btnCancel = document.getElementById("btnCancel");

    // Cập nhật trạng thái nhãn và điều khiển hiển thị hộp thoại
    function updateLabels() {
        if (toggleSwitch.checked) {
            socket.emit("cmd_Mode_Auto", 0);
            socket.emit("cmd_Mode_Manual", 1);
        } else {
            socket.emit("cmd_Mode_Auto", 1);
            socket.emit("cmd_Mode_Manual", 0);
        }
    
        // Hiển thị hộp thoại chính cho cả hai chế độ
        dialog.style.display = 'block';
    }

    // Lắng nghe sự kiện thay đổi trạng thái
    toggleSwitch.addEventListener("change", updateLabels);

    // Khi nhấn nút "Nhập hàng" trong chế độ Manual
    btnNhapHang.addEventListener("click", function () {
        if (toggleSwitch.checked) { // Kiểm tra nếu đang ở chế độ Manual
            const inputLabel = document.querySelector("#dialog-input label");
            inputLabel.textContent = "Nhập ô cần nhập hàng:"; // Cập nhật dòng chữ trong hộp thoại
            dialogInput.style.display = 'block'; // Hiển thị hộp thoại yêu cầu nhập ô
        }
    });

    // Khi nhấn nút "Xuất hàng" trong chế độ Manual
    btnXuatHang.addEventListener("click", function () {
        if (toggleSwitch.checked) { // Kiểm tra nếu đang ở chế độ Manual
            const inputLabel = document.querySelector("#dialog-input label");
            inputLabel.textContent = "Nhập ô cần xuất hàng:"; // Thay đổi dòng chữ trong hộp thoại
            dialogInput.style.display = 'block'; // Hiển thị hộp thoại yêu cầu nhập ô
        }
    });
    btnXacNhan.addEventListener("click", function () {
        const inputValue = document.getElementById("inputO").value.trim(); // Lấy giá trị và loại bỏ khoảng trắng
    
        if (inputValue && !isNaN(inputValue)) { // Kiểm tra giá trị hợp lệ
            const inputNumber = parseInt(inputValue, 10); // Chuyển giá trị nhập về số nguyên
    
            if (inputNumber >= 1 && inputNumber <= 9) {
                const inputLabel = document.querySelector("#dialog-input label").textContent.toLowerCase(); // Đổi về chữ thường
    
                if (inputLabel.includes("nhập hàng")) {
                    socket.emit(`cmd_Mode_Man_${inputNumber}A`, 1); // Lệnh cho Nhập hàng
                    console.log(`cmd_Mode_Man_${inputNumber}A sent!`);
                } else if (inputLabel.includes("xuất hàng")) {
                    // Tắt tất cả các biến Man_Out1A đến Man_Out9A
                    for (let i = 1; i <= 9; i++) 
                       
                    // Bật biến tương ứng với inputNumber
                    socket.emit(`cmd_Mode_Man_Out${inputNumber}A`, 1); // Bật biến ngay lập tức
                    console.log(`cmd_Mode_Man_Out${inputNumber}A sent!`);
                }
                dialogInput.style.display = 'none'; // Ẩn hộp thoại nhập ô
            } else {
                alert("Vui lòng nhập số từ 1 đến 9!");
            }
        } else {
            alert("Vui lòng nhập số hợp lệ!"); // Hiển thị cảnh báo nếu nhập không hợp lệ
        }
    });
    
    // Lắng nghe sự kiện click nút Cancel để đóng hộp thoại
    btnCancel.addEventListener("click", function () {
        dialogInput.style.display = 'none'; // Ẩn hộp thoại nhập ô
    });

    // Gọi hàm khi trang tải
    updateLabels();
});



// Hàm chức năng ẩn hoặc hiện Symbol dựa trên giá trị biến
function fn_SymbolVisibility(ObjectID, Tag)
{
    socket.on(Tag, function(data){
        console.log(data); 
        if (data == 1)
        {
            document.getElementById(ObjectID).style.display = "block"; // Hiển thị symbol
        }
        else
        {
            document.getElementById(ObjectID).style.display = "none"; // Ẩn symbol
        }
    });
}

function fn_IOFieldLoaihang(tag1, tag2, IOField1, IOField2, tofix) {
    // Lắng nghe dữ liệu từ tag1 và tag2 liên tục
    socket.on(tag1, function(data1){
        socket.on(tag2, function(data2){
            // Cập nhật dữ liệu vào textbox của SP_Quoc_te và SP_Noi_dia
            if (data1 === true && data2 === false) {
                document.getElementById(IOField1).value = "Quốc tế";  // Hiển thị "Quốc tế" khi SP_Quoc_te ON và SP_Noi_dia OFF
            } else if (data1 === false && data2 === true) {
                document.getElementById(IOField1).value = "Nội địa";  // Hiển thị "Nội địa" khi SP_Quoc_te OFF và SP_Noi_dia ON
            } else if (data1 === false && data2 === false) {
                document.getElementById(IOField1).value = "";  // Không hiển thị gì trong SP_Quoc_te textbox
            }
        });
    });
}


// Mảng trạng thái các ô chứa hàng
let Trang_thai = Array(9).fill(0);

// Kiểm tra kết nối socket
socket.on("connect", () => {
    console.log("Connected to server");
});

// Lắng nghe dữ liệu từ server
for (let i = 1; i <= 9; i++) {
    let tagName = `Trang_thai_${i}A`;
    socket.on(tagName, function(data) {
        console.log(`${tagName} received:`, data); // Debug
        Trang_thai[i - 1] = Number(data) || 0; // Chuyển thành số nguyên, tránh undefined
        updateEmptySlots();
    });
}

function updateEmptySlots() {
    console.log("Updated Trang_thai array:", Trang_thai); // Debug
    let emptySlotsCount = Trang_thai.filter(state => state === 0).length;
    document.getElementById('emptySlots').value = emptySlotsCount;
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => { updateEmptySlots(); }, 500); // Đợi dữ liệu socket
});











