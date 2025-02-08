
///////////////////////YÊU CẦU DỮ LIỆU TỪ SERVER////////////////////
var myVar = setInterval(myTimer, 100);
function myTimer(){
    socket.emit("Client-send-data", "Request data client");
}

//Hàm hiển thi dữ liệu lên IO Field
function fn_IOFieldDataShow(tag, IOField, tofix){
    socket.on(tag,function(data){
        if(tofix == 0){
            document.getElementById(IOField).value = data;
        } else{
        document.getElementById(IOField).value = data.toFixed(tofix);
        }
    });
}

//Hàm chức năng chuyển trang
function fn_ScreenChange(scr_1, scr_2, scr_3, scr_4){
    document.getElementById(scr_1).style.display = 'block'; // Hiển thị màn hình 1
    document.getElementById(scr_2).style.display = 'none';  // Ẩn màn hình 2
    document.getElementById(scr_3).style.display = 'none';  // Ẩn màn hình 3
    document.getElementById(scr_4).style.display = 'none';  // Ẩn màn hình 4
}
function fn_DataEdit(button1, button2){
    document.getElementById(button1).style.zIndex='1'; //Hien nut 1
    document.getElementById(button2).style.zIndex='0'; //An nut 2
}
//Hàm chức năng hiển thị màu Symbol//
function fn_SymbolStatus(ObjectID, SymName, Tag)
{
    var imglink_0 = "images/" + SymName + "_0.png";
    var imglink_1 = "images/" + SymName + "_1.png";
    
    socket.on(Tag, function(data){
        console.log(data); 
        if (data == 0)
        {
            document.getElementById(ObjectID).src = imglink_0;
        }
        else if (data == 1)
        {
            document.getElementById(ObjectID).src = imglink_1;
        }
        else
        {
            document.getElementById(ObjectID).src = imglink_0; 
        }
    });
}

function fn_btt_Color(tag, bttID, on_Color, off_Color){
    socket.on(tag, function(data){
        if(data == true){
            document.getElementById(bttID).style.backgroundColor = on_Color; 
        }else{
            document.getElementById(bttID).style.backgroundColor = off_Color;
        }
    });
}





