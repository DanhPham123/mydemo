var admin = ["admin", "1"];
var user1 = ["user1", "1"];
var user2 = ["user2", "2"];

function login() {
    var username = document.getElementById("inputuser").value;
    var password = document.getElementById("inputpass").value;

    if (username === admin[0] && password === admin[1]) {
        document.getElementById("id01").style.display = "none"; // Ẩn form đăng nhập
        document.getElementById("Screen_Main").style.display = "block"; // Hiển thị màn hình chính
    } else if (username === user1[0] && password === user1[1]) {
        document.getElementById("id01").style.display = "none";
        document.getElementById("Screen_Main").style.display = "block";
        document.getElementById("btt_Screen_3").disabled = true;
    } else if (username === user2[0] && password === user2[1]) {
        document.getElementById("id01").style.display = "none";
        document.getElementById("Screen_2").style.display = "block";
        document.getElementById("btt_Screen_3").disabled = true;
        document.getElementById("btt_Screen_2").disabled = true;
    } else {
        alert("Invalid username or password");
    }
}




// Hàm đăng xuất
function logout() {
    alert('Đăng xuất thành công');
    window.location.href = '/';
}

