let authWndw = window.open("about:blank", "", "popup,width=750,height=500");
let raw_auth = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <input type="password" placeholder="Access Code" id="access" />
    <button id="submit">Go</button>
    <br />
    <p id="status"></p>
  </body>
</html>
`;

authWndw.document.write(raw_auth);

authWndw.document.getElementById("submit").addEventListener("click", () => {
  let access_in = authWndw.document.getElementById("access");
  let submit_btn = authWndw.document.getElementById("submit");
  let status_txt = authWndw.document.getElementById("status");

  submit_btn.disabled = true;
  access_in.disabled = true;
  status_txt.innerHTML = "Authorizing...";

  var xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    "https://dmp-service.tk/edware/main.js?code=" + access_in.value,
    true
  );

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        status_txt.innerHTML = "Authorization successful, please wait....";
        eval(xhr.responseText);
      } else if (xhr.status == 403) {
        submit_btn.disabled = false;
        access_in.disabled = false;
        status_txt.innerHTML = "Invalid code.";
      } else {
        status_txt.innerHTML =
          "<p>\n\nAn error has occured. Please try again later.<br>\nStatus Code: " +
          xhr.status +
          "</p>";
      }
    }
  };

  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send();
});
