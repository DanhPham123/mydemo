const { TagBuilder, IotGateway } = require('kepserverex-js'); 
const tagBuilder = new TagBuilder ({ namespace: 'Channel3.Device1'});
const iotGateway = new IotGateway({
    host: '127.0.0.1', // Default host
    port: 5000         // Default port
});


/////////////////////////HÀM ĐỌC/GHI DỮ LIỆU XUỐNG KEPWARE (PLC)////////////////////////////////////

//Đoc dữ liệuliệu
var tagArr = []; // chứa dữ liệu tag đọc từ PLC
function fn_tagRead() // hàm đọc dữ liệu tag
{
    iotGateway.read(TagList).then((data) => {
        var lodash = require('lodash');
        tagArr = lodash.map(data, (item) => item.v);
        console.log(tagArr);
    });
}

// Ghi dữ liệuliệu
function fn_Data_Write(tag, data) // hàm ghi dữ liệu tag xuống PLC
{
    tagBuilder.clean(); // làm sạch bộ nhớ đệm
    const set_value = tagBuilder
        .write(tag, data)
        .get();
    iotGateway.write(set_value);
}

/////////////////////////ĐỊNH NGHĨA TAG////////////////////////////////////
//Khai báo tag
var START = 'START';
var STOP = 'STOP';
var AUTO = 'AUTO';
var MANUAL = 'MANUAL';
var NHAP_HANG = 'NHAP_HANG';
var XUAT_HANG = 'XUAT_HANG';
var LRUN = 'LRUN';
var LSTOP = 'LSTOP';
var CB1 = 'CB1';
var BANG_TAI = 'BANG_TAI';
var Toa_do_X = 'Toa_do_X';
var Toa_do_Y = 'Toa_do_Y';
var Toa_do_Z = 'Toa_do_Z';
var Trang_thai_1A = 'Trang_thai_1A';
var Trang_thai_2A = 'Trang_thai_2A';
var Trang_thai_3A = 'Trang_thai_3A';
var Trang_thai_4A = 'Trang_thai_4A';
var Trang_thai_5A = 'Trang_thai_5A';
var Trang_thai_6A = 'Trang_thai_6A';
var Trang_thai_7A = 'Trang_thai_7A';
var Trang_thai_8A = 'Trang_thai_8A';
var Trang_thai_9A = 'Trang_thai_9A';
var Man_1A = 'Man_1A';
var Man_2A = 'Man_2A';
var Man_3A = 'Man_3A';
var Man_4A = 'Man_4A';
var Man_5A = 'Man_5A';
var Man_6A = 'Man_6A';
var Man_7A = 'Man_7A';
var Man_8A = 'Man_8A';
var Man_9A = 'Man_9A';
var Man_Out1A = 'Man_Out1A';
var Man_Out2A = 'Man_Out2A';
var Man_Out3A = 'Man_Out3A';
var Man_Out4A = 'Man_Out4A';
var Man_Out5A = 'Man_Out5A';
var Man_Out6A = 'Man_Out6A';
var Man_Out7A = 'Man_Out7A';
var Man_Out8A = 'Man_Out8A';
var Man_Out9A = 'Man_Out9A';
var Ma_phat_hien = 'Ma_phat_hien';
var SP_Quoc_te = 'SP_Quoc_te';
var SP_Noi_dia = 'SP_Noi_dia';
var QT28394B9S6G7 = 'QT28394B9S6G7';
var QT247G084HZ78 = 'QT247G084HZ78';
var ND287X8W9F036 = 'ND287X8W9F036';
var ND2354ZZ6WHG7 = 'ND2354ZZ6WHG7';

//Đọc dữ liệu
const TagList = tagBuilder
.read(START)
.read(STOP)
.read(AUTO)
.read(MANUAL)
.read(NHAP_HANG)
.read(XUAT_HANG)
.read(LRUN)
.read(LSTOP)
.read(CB1)
.read(BANG_TAI)
.read(Toa_do_X)
.read(Toa_do_Y)
.read(Toa_do_Z)
.read(Trang_thai_1A)
.read(Trang_thai_2A)
.read(Trang_thai_3A)
.read(Trang_thai_4A)
.read(Trang_thai_5A)
.read(Trang_thai_6A)
.read(Trang_thai_7A)
.read(Trang_thai_8A)
.read(Trang_thai_9A)
.read(Man_1A)
.read(Man_2A)
.read(Man_3A)
.read(Man_4A)
.read(Man_5A)
.read(Man_6A)
.read(Man_7A)
.read(Man_8A)
.read(Man_9A)
.read(Man_Out1A)
.read(Man_Out2A)
.read(Man_Out3A)
.read(Man_Out4A)
.read(Man_Out5A)
.read(Man_Out6A)
.read(Man_Out7A)
.read(Man_Out8A)
.read(Man_Out9A)
.read(Ma_phat_hien)
.read(SP_Quoc_te)
.read(SP_Noi_dia)
.read(QT28394B9S6G7)
.read(QT247G084HZ78)
.read(ND287X8W9F036)
.read(ND2354ZZ6WHG7)
.get();

/////////////////////////QUÉT DỮ LIỆU////////////////////////////////////
//Tạo Timer quét dữ liệu
setInterval(
    () => fn_read_data_scan(),
    1000 //1000ms = 1s
);
//Quét dữ liệu
function fn_read_data_scan(){
    fn_tagRead();   //Đọc giá trị tag
}

// THIẾT LẬP KẾT NỐI WEBSERVER//
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
//Home calling
app.get("/", function(req, res){
    res.render("home");
});


/////////////////////////TRUYỀN NHẬN DỮ LIỆU VỚI TRÌNH DUYỆT WEB////////////////////////////////////
io.on("connection", function(socket) {
    socket.on("cmd_Mode_START", function(data) {
        // Ghi giá trị 1 vào tag Stop khi nhấn nút
        fn_Data_Write(START, data); 
        // Đợi 500ms rồi ghi lại giá trị 0 vào tag Stop
        setTimeout(function() {
            fn_Data_Write(START, 0); 
        }, 500); // 500ms delay (có thể thay đổi thời gian nếu cần)
    });
    socket.on("cmd_Mode_STOP", function(data) {
        // Ghi giá trị 1 vào tag Stop khi nhấn nút
        fn_Data_Write(STOP, data); 
        // Đợi 500ms rồi ghi lại giá trị 0 vào tag Stop
        setTimeout(function() {
            fn_Data_Write(STOP, 0); 
        }, 500); // 500ms delay (có thể thay đổi thời gian nếu cần)
    });
    socket.on("cmd_Mode_Auto", function (data) {
        fn_Data_Write(AUTO, data); // Ghi giá trị AUTO
        setTimeout(function() {
            fn_Data_Write(AUTO, 0); 
        }, 500); // 500ms delay (có thể thay đổi thời gian nếu cần)
    });

    socket.on("cmd_Mode_Manual", function (data) {
        fn_Data_Write(MANUAL, data); // Ghi giá trị MANUAL
        setTimeout(function() {
            fn_Data_Write(MANUAL, 0); 
        }, 500); // 500ms delay (có thể thay đổi thời gian nếu cần)
    });
    // NHẬP HÀNG
    socket.on("cmd_Mode_Nhaphang", function (data) {
        fn_Data_Write(NHAP_HANG, data);
        setTimeout(function() {
            fn_Data_Write(NHAP_HANG, 0); 
        }, 500); // 500ms delay (có thể thay đổi thời gian nếu cần)
        
    });
    // XUẤT HÀNG
    socket.on("cmd_Mode_Xuathang", function (data) {
        fn_Data_Write(XUAT_HANG, data);
        setTimeout(function() {
            fn_Data_Write(XUAT_HANG, 0); 
        }, 500); // 500ms delay (có thể thay đổi thời gian nếu cần)
    });
    ////////////////////// ĐIỀU KHIỂN BẰNG TAY///////////////////////////
    function handleManualCommand(tag, data) {
        fn_Data_Write(tag, data);
        setTimeout(() => fn_Data_Write(tag, 0), 500); // 500ms delay (có thể thay đổi thời gian nếu cần)
    }
    
    // Sử dụng một hàm chung cho các lệnh
    socket.on("cmd_Mode_Man_1A", (data) => handleManualCommand(Man_1A, data));
    socket.on("cmd_Mode_Man_2A", (data) => handleManualCommand(Man_2A, data));
    socket.on("cmd_Mode_Man_3A", (data) => handleManualCommand(Man_3A, data));
    socket.on("cmd_Mode_Man_4A", (data) => handleManualCommand(Man_4A, data));
    socket.on("cmd_Mode_Man_5A", (data) => handleManualCommand(Man_5A, data));
    socket.on("cmd_Mode_Man_6A", (data) => handleManualCommand(Man_6A, data));
    socket.on("cmd_Mode_Man_7A", (data) => handleManualCommand(Man_7A, data));
    socket.on("cmd_Mode_Man_8A", (data) => handleManualCommand(Man_8A, data));
    socket.on("cmd_Mode_Man_9A", (data) => handleManualCommand(Man_9A, data));
    socket.on("cmd_Mode_Man_Out1A", (data) => handleManualCommand(Man_Out1A, data));
    socket.on("cmd_Mode_Man_Out2A", (data) => handleManualCommand(Man_Out2A, data));
    socket.on("cmd_Mode_Man_Out3A", (data) => handleManualCommand(Man_Out3A, data));
    socket.on("cmd_Mode_Man_Out4A", (data) => handleManualCommand(Man_Out4A, data));
    socket.on("cmd_Mode_Man_Out5A", (data) => handleManualCommand(Man_Out5A, data));
    socket.on("cmd_Mode_Man_Out6A", (data) => handleManualCommand(Man_Out6A, data));
    socket.on("cmd_Mode_Man_Out7A", (data) => handleManualCommand(Man_Out7A, data));
    socket.on("cmd_Mode_Man_Out8A", (data) => handleManualCommand(Man_Out8A, data));
    socket.on("cmd_Mode_Man_Out9A", (data) => handleManualCommand(Man_Out9A, data));
})


/////////////////////////LẬP BẢNG TAG ĐỂ GỬI DỮ LIỆU QUA CLIENT////////////////////////////////////
function fn_tag(){
    io.sockets.emit("START", tagArr[0]);
    io.sockets.emit("STOP", tagArr[1]);
    io.sockets.emit("AUTO", tagArr[2]);
    io.sockets.emit("MANUAL", tagArr[3]);
    io.sockets.emit("NHAP_HANG", tagArr[4]);
    io.sockets.emit("XUAT_HANG", tagArr[5]);
    io.sockets.emit("LRUN", tagArr[6]);
    io.sockets.emit("LSTOP", tagArr[7]);
    io.sockets.emit("CB1", tagArr[8]);
    io.sockets.emit("BANG_TAI", tagArr[9]);
    io.sockets.emit("Toa_do_X", tagArr[10]);
    io.sockets.emit("Toa_do_Y", tagArr[11]);
    io.sockets.emit("Toa_do_Z", tagArr[12]);
    io.sockets.emit("Trang_thai_1A", tagArr[13]);
    io.sockets.emit("Trang_thai_2A", tagArr[14]);
    io.sockets.emit("Trang_thai_3A", tagArr[15]);
    io.sockets.emit("Trang_thai_4A", tagArr[16]);
    io.sockets.emit("Trang_thai_5A", tagArr[17]);
    io.sockets.emit("Trang_thai_6A", tagArr[18]);
    io.sockets.emit("Trang_thai_7A", tagArr[19]);
    io.sockets.emit("Trang_thai_8A", tagArr[20]);
    io.sockets.emit("Trang_thai_9A", tagArr[21]);
    io.sockets.emit("Man_1A", tagArr[22]);
    io.sockets.emit("Man_2A", tagArr[23]);
    io.sockets.emit("Man_3A", tagArr[24]);
    io.sockets.emit("Man_4A", tagArr[25]);
    io.sockets.emit("Man_5A", tagArr[26]);
    io.sockets.emit("Man_6A", tagArr[27]);
    io.sockets.emit("Man_7A", tagArr[28]);
    io.sockets.emit("Man_8A", tagArr[29]);
    io.sockets.emit("Man_9A", tagArr[30]);
    io.sockets.emit("Man_Out1A", tagArr[31]);
    io.sockets.emit("Man_Out2A", tagArr[32]);
    io.sockets.emit("Man_Out3A", tagArr[33]);
    io.sockets.emit("Man_Out4A", tagArr[34]);
    io.sockets.emit("Man_Out5A", tagArr[35]);
    io.sockets.emit("Man_Out6A", tagArr[36]);
    io.sockets.emit("Man_Out7A", tagArr[37]);
    io.sockets.emit("Man_Out8A", tagArr[38]);
    io.sockets.emit("Man_Out9A", tagArr[39]);
    io.sockets.emit("Ma_phat_hien", tagArr[40]);
    io.sockets.emit("SP_Quoc_te", tagArr[41]);
    io.sockets.emit("SP_Noi_dia", tagArr[42]);
    io.sockets.emit("QT28394B9S6G7", tagArr[43]);
    io.sockets.emit("QT247G084HZ78", tagArr[44]);
    io.sockets.emit("ND287X8W9F036", tagArr[45]);
    io.sockets.emit("ND2354ZZ6WHG7", tagArr[46]);
}
/////////////////////////GỬI GIÁ TRỊ BẢNG TAG ĐẾN TRÌNH DUYỆT////////////////////////////////////
io.on("connection", function(socket){
    socket.on("Client-send-data", function(data){
        fn_tag();
});});

