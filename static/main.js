let authWndw = window.open("about:blank", "", "popup,width=750,height=500");

let url_params = window.location.href.split("/");

function element_id(n) {
  return authWndw.document.getElementById(n);
}

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function request(
  url,
  callback,
  fail_callback,
  headers = [],
  method = "GET",
  content = null
) {
  if (window.__EDPUZZLE_DATA__ && window.__EDPUZZLE_DATA__.token) {
    headers.push(["authorization", window.__EDPUZZLE_DATA__.token]);
  }

  fetch(url, {
    method: method,
    headers: headers,
    body: content,
  })
    .then((response) => response.text())
    .then((response) => {
      callback(response);
    });
}

function init() {
  if (
    /https:\/\/edpuzzle.com\/assignments\/[a-f0-9]{1,30}\/watch/.test(
      window.location.href
    )
  ) {
    loadAssignment();
  } else {
    authWndw.document.write(
      "You must run this script on a valid EdPuzzle assignment."
    );
  }
}

function loadAssignment() {
  let assignment_id = url_params[4];

  request(
    "https://edpuzzle.com/api/v3/assignments/" + assignment_id,
    (res) => {
      createWindow(JSON.parse(res));
    },
    (code) => {
      authWndw.document.write(
        "Failed to load this assignment from EdPuzzle.<br>Status Code: " + code
      );
    }
  );
}

function createWindow(assignment) {
  var raw_header = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @import url("https://fonts.googleapis.com/css?family=Martel+Sans");

      body {
        margin: 0;
        font-family: "Martel Sans", sans-serif;
      }

      .topbar {
        align-items: center;
        justify-content: center;
        text-align: center;
        background-color: #1e1e23;
        padding: 8px;
        display: flex;
        justify-content: left;
        height: 32px;
      }

      .logo {
        height: 40px;
        width: 40px;
        display: block;
      }

      h1 {
        color: #ffffff;
        font-size: 20px;
        font-weight: 100;
        margin-left: 8px;
      }

      .container {
        display: flex;
      }

      .column {
        flex: 1;
        padding: 4px;
        clear: both;
      }

      .column-left {
        border-right: 1px solid black;
        display: flex;
      }

      .column-right {
        border-left: 1px solid black;
        align-items: center;
        text-align: center;
      }

      .thumbnail {
        width: 40%;
        margin: 4%;
        border: 1px solid black;
      }

      .video-info {
        width: 80%;
        align-items: center;
      }

      .video-meta-container {
        width: 40%;
        margin: 5%;
        float: right;
      }

      .video-title {
        font-weight: lighter;
        font-size: 14px;
      }

      .video-subtitle {
        font-weight: bold;
        font-size: 12px;
      }

      .note-text {
        font-size: 11pt;
      }

      .question {
        font-size: 10pt;
        text-align: left;
        margin: 4px;
        background-color: #f4f4f4;
        border-radius: 8px;
        padding: 8px;
      }

      .choice-correct {
        color: #00aa00;
        text-decoration: underline;
      }

      .footer {
        width: 90%;
        margin: auto;
        border-top: 2px solid black;
        align-items: center;
        justify-content: left;
        text-align: left;
        display: flex;
      }

      .footer-logo {
        width: 30px;
        height: 30px;
        display: block;
      }

      .footer-text {
        font-size: 8pt;
        margin: 8px;
      }
    </style>
  </head>

  <body>
    <div class="topbar">
      <img
        class="logo"
        src="https://lh3.googleusercontent.com/fife/AMPSemc912gA9564vayqVeagXzlHcu1pzgXM3dbJG8839wCyWEKmsNtK8yv8Y4DtANLdd1CHYlmTSFXQrrxTdlIzkqyntYLx9Fj6tqnjSoaa2F_tLWnI4jAdOKW5nTSUQRsCh86CgGlGALXuNn4bTufz6I_90Vwu1Fm6afV2OeoJCZItVSojs3gi5fVZdDuKKjI8fAwBGlxngvP11S5LyJDyfn9FjJj-V4rV85YEv7821tkWrOiXmSZ9sFc3PTdvxxj3jgLMDAkiIp883Cl9g_gS2384_0JbpYBpnTySyxl7p5IRTIAvLe2OIkxama75FOvHO8vn6zS5sV1s3cY63bzVdsZPmQhadVy_VLIINxAxjzu45A4jceeVzs1VDyem_c8WIGIoNsda1CCjtLzUzoSuS99Caevw9O9OFOJncLmUV8lwCk4axt6Nb-A7xUQlAZejGe0ADfbbIAWH1xMMfqgx7HhdkYLA1-ecmDNZ9eJ4y6oKyXNq9oIrXdewh6iU1nqXCpVOAdHK1rjlooB0jrfvbAzyzKyRmStr783BzvgUqBlEKoHnhvE6y5aDab5Vlt9BEmXp2LSVOqDx1QjbTnQCcCA8ewZykpNyVwHhikLjx1M9TsgdT9kgj8H1rbyukrc0UV2gOFfhRE0SM38f143r5wuykfKsxKgzMUd-ENigjhlCMk5PTFYGvK_7IUNgCedq124MHknikMqHUXwASQDd1xzee0X7R7iCUEl3cV-4hwGp9x8GMnxByCRl6N52L4itEeSh3PEvIkRcFPQICb2daasn7yY0u-Jm0J8JZGqudNIXmxvpzZZm16wCVxOI6okDoyP43PjgNuZBePBvbQdG_qIc-LbTR3j0EkTT2gWphgfEolnO7CKf-OWjcUXGjTxH4MDTQTfsuHjTs1_TmwhrjzauyCbEODAAA2M8IbPoA6ThmeBJ0r2B2DOLA2FgyAVOGFxFT6VFrl8cZ5dhwSiTEIGx5L1KwQiYFQLdPm1_qaQBp1dEPxKkls1k3Yoj0HnxuFDy9PWUzS0gW7F_xzScA35Y5KTkJaS7DOya-TAqpDXwYb_Rfw5Yqv62eCUq03Qxn_SnSkpHWCLpyUXTFnz8zKXotvuLPHgt_qQtc9L2_EUa2u2PBA1N-LRFQbfAlftvFJMzkVsJR7XA_JkJeKWfm9nImfuqcO4bavAnBLeNnsUYwSm4ILPpJ1H3qg6w_vjSFmwsG6NQ3H2QgidaEAHq253wxX8dEkJvOYFe6dtCCqf19t0s9DIWHy0h4bfduNxSrsu6OZcjACWc6B3FDF9OjWMcfo3U279XHPjfmPjG_nOESX5ulWE1EPeryu5iFiRyP2EuZTuAUXW3-nYech-i5pukag17Z1rfdc5l2FOrimcPb9r-LFq_IN0Ln3S_Ooq-GdtLkzdA8QNx0_pVCtrO8HMtsJMGijw0HyOWF_G3_3-2_ihu13GtSOhnf1I6oEFiEuC-TrmZGyYG2oAZyh6IccDY8HFydFgduhbyVSUdBW_k-FF2DJFw6NRyAM5H=w1015-h930"
        alt=""
      />
      <h1>edware</h1>
    </div>

    <div class="container">
      <div class="column column-left">
        <div class="video-info">
          <img
            id="video-thumbnail"
            class="thumbnail"
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
            alt="Video Thumbnail"
          />
          <div class="video-meta-container">
            <h3 id="video-title" class="video-meta video-title">
              Loading Title...
            </h3>
            <h3 id="video-author" class="video-meta video-subtitle">
              Loading Author...
            </h3>
            <h3 id="video-date-created" class="video-meta video-subtitle">
              Loading Date...
            </h3>
            <h3 id="video-date-updated" class="video-meta video-subtitle">
              Loading Date...
            </h3>
          </div>
        </div>
      </div>

      <div id="questions-column" class="column column-right">
        <p id="question-note" class="note-text">
          Questions and answers are listed below.
        </p>
        <!--
        <div class="question">
          <h4 class="question-time">[00:00]</h4>
          <h5 class="question-title">
            What is the blah blah blah blah blah blah blah????
          </h5>
          <ul class="question-options">
            <li class="question-choice">Option 1</li>
            <li class="question-choice">Option 2</li>
            <li class="question-choice">
              this is the third option as it stands and will ever be
            </li>
          </ul>
        </div>
      --></div>
    </div>
  </body>
</html>`;
  var media = assignment.medias[0];

  var createdDate = new Date(media.createdAt);
  var updatedDate = new Date(media.updatedAt);
  var thumbnail = media.thumbnailURL;

  authWndw.document.write(raw_header);
  element_id("video-title").innerHTML = media.title;
  element_id("video-author").innerHTML = "By: " + media.user.name;
  element_id(
    "video-date-created"
  ).innerHTML = `Created: ${createdDate.getMonth()}/${createdDate.getDay()}/${createdDate.getFullYear()}`;
  element_id(
    "video-date-updated"
  ).innerHTML = `Updated: ${updatedDate.getMonth()}/${updatedDate.getDay()}/${updatedDate.getFullYear()}`;
  element_id("video-thumbnail").src =
    (thumbnail.startsWith("/") && "https://edpuzzle.com" + thumbnail) ||
    thumbnail;

  getMedia(assignment);
}

function getMedia(assignment, needle = "", request_count = 1) {
  var mediaId = assignment.teacherAssignments[0].contentId;
  var classroomId = assignment.teacherAssignments[0].classroom.id;
  var mediaUrl =
    "https://edpuzzle.com/api/v3/assignments/classrooms/" +
    classroomId +
    "/students/?needle=" +
    needle;

  request(
    mediaUrl,
    (res) => {
      var classroom = JSON.parse(res);

      if (classroom.medias.length == 0) {
        parseQuestions(null);
        return;
      }

      classroom.medias.forEach((media) => {
        if (media._id == mediaId) {
          parseQuestions(media.questions);
          return;
        }
      });

      getMedia(
        assignment,
        classroom.teacherAssignments[classroom.teacherAssignments.length - 1]
          ._id,
        request_count + 1
      );
    },
    (errStatus) => {
      element_id("question-note").innerHTML =
        "An error has occured trying to fetch this assignment media. Status Code: " +
        errStatus;
    }
  );
}

function parseQuestions(questions) {
  if (!questions) return;

  for (let i = 0; i < questions.length; i++) {
    for (let j = 0; j < questions.length - i - 1; j++) {
      if (questions[j].time > questions[j + 1].time) {
        let question_old = questions[j];
        questions[j] = questions[j + 1];
        questions[j + 1] = question_old;
      }
    }
  }

  questions.forEach((question) => {
    var toWrite = `<div class="question">`;
    toWrite += `<h4 class="question-time">[${str_pad_left(
      Math.floor(question.time / 60),
      "0",
      2
    )}:${str_pad_left(Math.floor(question.time % 60), "0", 2)}.${(
      question.time - Math.floor(question.time)
    )
      .toFixed(1)
      .substring(2)}]</h4>`;
    toWrite += `<h5 class="question-title">${question.body[0].html}</h5>`;

    if (question.type == "multiple-choice") {
      toWrite += `<ul class="question-options">`;

      question.choices.forEach((choice) => {
        toWrite += `<li class="${
          (choice.isCorrect && "question-choice choice-correct") ||
          "question-choice"
        }">${choice.body[0].html}</li>`;
      });

      toWrite += `</ul>`;
    } else {
      toWrite +=
        "<p>This is an open-ended respoonse that will be graded by the manually.</p>";
    }

    toWrite += `</div>`;

    element_id("questions-column").innerHTML += toWrite;
  });

  footer_html = `
      <div class="footer">
        <img class="footer-logo" src="https://lh3.googleusercontent.com/fife/AMPSemcFdTCFWIXYB5_uDz7Zu_wVW0YV1RvyXcVYP0j7sBA3mkPpMBZ9Ko0cQjoS5X_Syhr5UIWzs7SubFN2wDYJ6apVlZ_lQAHdb3fef4LOoyVBo5JLRO5K3oylfzMJzxRay4-4DSRQPkkRic_PVJt7a5xne00ZT0CdKs1UeS-ZUnTFaNbfqDxY4B7vbHM4vg4fxqVWi7lu8h-c_0_FGMoGhruVVN9vOGPrPmGD2plraOjWhuQpMzyra_wC_UEqldd8X6iDiFR4RUEWegrH1DgpdC-ROPLwRIcEez_1hxGHEyhJja5V1OL_9e2i-sYrAz7Yi5Mj9AEQq85dA85t1JimjqrEUMWimlcbkdpUYENQumkim3brsfHzmd_TSEfJF1ePyTeKKuIXeq31-r6pD-OweNMsw4E_dnUck0-wPeNZEXBTAudwbkHoa1j2l3km-jjASh1lSBBUKmSTByL8k2adlqWMvosTguILXzLWYezCcxJXOrHSpBFFzifUydkuIIL6xDqjOPcBvhkPNtHNq7YVoqz0yKo11eGRamirmWqe8ugts5zTxMRDhTwgJrfuTH5CsQ5xPDe4U6vlDOyIqnxxaHHNsM6s8lT28cGC4I3onmOd8r29Xmov91RGnx5tCvQBbFIDHHs5DqZq6Qk0KPM56dhGSM2TtoG0N8wEhknuOAebgpS2nTWQxFtAiUd9_KGxsOPicWi8VeyTTtK2ovbipENwE7_tU2hqmq3q5JYUus_X80SRaw_0GmzD-_2utF0MQDen8tjkj6SJjPoCxWWzKpCQynP2cEE14WqwcmDxPnHXgu3jovIPWZSgmZKtKVuOF1wjQQPSHJc9KYKc0yUg_YmvwcWS0HLDzBvybWYpgPl5oFUbTMU3hGHI28PQsXfJsUbaZS9ZDS2JIOMp2VATkenbmyxjr5xTqNosWEnW3fNpLc-YMI8ASgnaHKQfFx9eX9au4MDJ3WMaXxCmyIlEE12VQ_2tPthwCbmLgs7MIk0YYGZEwaur7wWDcBDsRfX4aG9yb6BrXEDm6VMHGzP5cwrEo-j2mKcnHFBKkSQg0MEUx0jMFDf0aREt7WtQKp8c0OakAQt32L75twZW9Pn4dzNyxym3tt0PWypFj14viDOblKIqswTqaotAWHmHl74447bjuCaBhwrBOY1thxuMoyMMOYhDW7Gqko63Dqe4edl6EWKs5NdK3F9DZs7J3sAHkiQUfC3TJJmtlOkEER3O8RzOUAe3YysUqxYuOrUSSIYfY6Fo9I6GkqoqCT-ntK9fIGisFRqSJPKzJZci0eF573HT3KCrEQqIcJVzlih_0lAr_IOqZr8Orh7-w4nqLLY-5LJVJUrEgRhTCVQnlMXCG9h5aejjmrn_jjANp1U0T71yBoid6__W0zo6NNr35xIpS4EB87_6v58Qg_5DDHZId0Ii-WDfRh19BHnJMIWVxGW63lUBzg0q6dTbdH332YTP1n1qd3qjHFrNbux9oxQGr3yxLM7YFzrOF123gywffVxdfeBm0qw9Ao6WllAn=w1609-h930" alt="" />
        <p class="footer-text">edware by DMP Service. Unauthorized modification or distribution of this software is prohibited. We are not responsible for any consequences as a result of accessing this application.</p>
      </div>
    </body>
  </html>`;
  
  authWndw.document.write(footer_html);
}

init();
