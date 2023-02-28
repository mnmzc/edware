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
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        callback(xhr.response);
      } else if (fail_callback) {
        fail_callback(xhr.status);
      }
    }
  };
  xhr.open(method, url, true);

  if (window.__EDPUZZLE_DATA__ && window.__EDPUZZLE_DATA__.token) {
    headers.push(["authorization", window.__EDPUZZLE_DATA__.token]);
  }
  headers.forEach((header) => {
    xhr.setRequestHeader(header[0], header[1]);
  });

  xhr.send(content);
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
      let assignment = JSON.parse(res);

      createWindow(assignment);
    },
    (code) => {
      authWndw.document.write(
        "Failed to load this assignment from EdPuzzle.<br>Status Code: " + code
      );
    }
  );
}

function createWindow(assignment) {
  var media = assignment.medias[0];

  request(
    "https://raw.githubusercontent.com/mnmzc/edware/master/static/main_header.html",
    (res) => {
      var createdDate = new Date(media.createdAt);
      var updatedDate = new Date(media.updatedAt);

      authWndw.document.write(res);
      element_id("video-title").innerHTML = media.title;
      element_id("video-author").innerHTML = "By: " + media.user.name;
      element_id(
        "video-date-created"
      ).innerHTML = `Created: ${createdDate.getMonth()}/${createdDate.getDay()}/${createdDate.getFullYear()}`;
      element_id(
        "video-date-updated"
      ).innerHTML = `Updated: ${updatedDate.getMonth()}/${updatedDate.getDay()}/${updatedDate.getFullYear()}`;
      element_id("video-thumbnail").src = thumbnail.startsWith("/") && 'https://edpuzzle.com' + thumbnail || thumbnail

      getMedia(assignment);
    },
    (code) => {
      authWndw.document.write("Failed to load HTML.<br>Status Code: " + code);
    }
  );
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

  request("https://raw.githubusercontent.com/mnmzc/edware/master/static/main_footer.html", (res2) => {
    authWndw.document.write(res2);
  });
}

init();
