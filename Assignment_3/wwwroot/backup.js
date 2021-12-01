function prevButtonenableStyle() {
  document.getElementById('prev').disabled = false;
  document.getElementById('prev').style.color = 'black';
}
function nextButtonenableStyle() {
  document.getElementById('next').disabled = false;
  document.getElementById('next').style.color = 'black';
}
function firstButtonenableStyle() {
  document.getElementById('first').disabled = false;
  document.getElementById('first').style.color = 'black';
}
function endButtonenableStyle() {
  document.getElementById('end').disabled = false;
  document.getElementById('end').style.color = 'black';
}
function prevButtondisableStyle() {
  document.getElementById('prev').disabled = true;
  document.getElementById('prev').style.color = 'grey';
}
function nextButtondisableStyle() {
  document.getElementById('next').disabled = true;
  document.getElementById('next').style.color = 'grey';
}
function firstButtondisableStyle() {
  document.getElementById('first').disabled = true;
  document.getElementById('first').style.color = 'grey';
}
function endButtondisableStyle() {
  document.getElementById('end').disabled = true;
  document.getElementById('end').style.color = 'grey';
}
prevButtondisableStyle();
firstButtondisableStyle();
endButtondisableStyle();
nextButtondisableStyle();
var mainList = document.createElement('DIV');
mainList.classList.add('filelist-button');
var xhttp = new XMLHttpRequest();
var cur_page = 0;
var content = [];
var pagecount = 0;
var contentPage;
let startIndex = 0;
let endIndex;
let prevContent;
var fullContent;
var prevfullcontent;
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var resp = JSON.parse(this.responseText);

    resp.forEach(function (item) {
      let li = document.createElement('BUTTON');
      li.classList.add('listbutton');

      li.addEventListener('click', function () {
        var x = document.createElement('EMBED');
        x.src = '/images/' + item;
        document.getElementById('hid_file').value = item;
        var xhttp_ = new XMLHttpRequest();
        xhttp_.onreadystatechange = function () {
          cur_page = 0;
          var MyArray = this.responseText.split(' ');
          pagecount = Math.ceil(MyArray.length / 25);
          if (pagecount > 1) {
            nextButtonenableStyle();
            endButtonenableStyle();
          } else {
            nextButtondisableStyle();
            endButtondisableStyle();
          }

          content = makeChunkArray(MyArray);

          cur_page = 0;
          contentPage = content[0].join(' ');
          fullContent = contentPage;
          prevfullcontent = contentPage;
          highLightStart = 0;
          startSearchIndex = 0;
          highLightEnd = 0;
          difference = 0;
          startOffset = 0;
          document.getElementById('searchnext').disabled = false;
          document.getElementById('inputTextToSave').value =
            content[cur_page].join(' ');
          endSearchIndex =
            document.getElementById('inputTextToSave').value.length - 1;
        };
        xhttp_.open(
          'GET',
          'http://localhost:5000/images/' +
            item +
            '?v' +
            Math.floor(Math.random() * 100),
          true
        );
        xhttp_.send();
        document.getElementById('inputTextToSave').innerHTML = x.innerText;
      });
      mainList.appendChild(li);
      li.innerHTML += item;
    });
  }
};
xhttp.open('GET', 'http://localhost:5000/api/FileService/imagenames', true);
xhttp.send();
document.getElementById('files').appendChild(mainList);

function makeChunkArray(myArray) {
  var chunks = [];

  document.getElementById('hid_data').value = myArray.join(' ');
  var arrayLength = myArray.length;
  var index = 0;
  var tempAr = [];
  for (index = 0; index < arrayLength; index += 25) {
    var chunk = myArray.slice(index, index + 25);
    tempAr.push(chunk);
  }

  return tempAr;
}

function mergeChunks() {
  var all_lines = [];
  for (i = 0; i < content.length; i++) {
    for (j = 0; j < content[i].length; j++) {
      all_lines.push(content[i][j]);
    }
  }
  content = makeChunkArray(all_lines);
}
function go_next(step) {
  var prev_page = cur_page;
  if (cur_page >= 0 && cur_page < pagecount) {
    cur_page += step;
    if (cur_page >= pagecount) {
      cur_page = pagecount - 1;
    }

    if (cur_page < 0) {
      cur_page = 0;
    }
    var current_content = document.getElementById('inputTextToSave').value;

    current_splitted = current_content.split(' ');

    content[prev_page] = current_splitted;
    mergeChunks();

    document.getElementById('inputTextToSave').value =
      content[cur_page].join(' ');
  }
  if (cur_page == pagecount - 1) {
    nextButtondisableStyle();
    endButtondisableStyle();
    prevButtonenableStyle();
    firstButtonenableStyle();
  } else if (cur_page === 0) {
    prevButtondisableStyle();
    firstButtondisableStyle();
    endButtonenableStyle();
    nextButtonenableStyle();
  } else {
    prevButtonenableStyle();
    firstButtonenableStyle();
    endButtonenableStyle();
    nextButtonenableStyle();
  }
}

function go_first(step) {
  if (step === 0) {
    prevButtondisableStyle();
    nextButtonenableStyle();
    endButtonenableStyle();
    firstButtondisableStyle();
  } else {
    endButtondisableStyle();
    nextButtondisableStyle();
    prevButtonenableStyle();
    firstButtonenableStyle();
  }
  var prev_page = cur_page;

  if (step == 0) {
    cur_page = 0;
  } else {
    cur_page = pagecount - 1;
  }

  var current_content = document.getElementById('inputTextToSave').value;

  current_splitted = current_content.split(' ');

  content[prev_page] = current_splitted;
  mergeChunks();

  document.getElementById('inputTextToSave').value =
    content[cur_page].join(' ');
}
var highLightStart;
var highLightEnd;
var startOffset = 0;
var endOffSet = 0;
var input;
var firstSpanContent;
var originallen = 0;
var replaceLen = 0;
var difference;
var SaveFileContent = '';
function HighLightContent() {
  firstSpanContent = prevfullcontent.substring(0, highLightStart + startOffset);

  contentPage = contentPage.substring(highLightEnd, contentPage.length);
  input = document.getElementById('inputTextToSave');

  input.focus();
  input.setSelectionRange(
    highLightStart + startOffset,
    highLightEnd + startOffset
  );
  var indexOfSearchValues = highLightStart + startOffset;

  startOffset += highLightEnd;
}

function FindtheWord() {
  var replaceValue = document.getElementById('replace-value').value;
  searchValue = document.getElementById('search-value').value;
  highLightStart = contentPage.search(searchValue);
  highLightEnd = highLightStart + searchValue.length;
  contentPage = document.getElementById('inputTextToSave').value;
  prevfullcontent = contentPage;
  if (highLightStart === -1) {
    if (cur_page != pagecount - 1) {
      go_next(1);
      contentPage = document.getElementById('inputTextToSave').value;
      prevfullcontent = contentPage;
    }
  }
  HighLightContent();
}

function FindAndReplace() {
  startOffset += difference;
  searchValue = document.getElementById('search-value').value;
  originallen = searchValue.length;

  var replaceValue = document.getElementById('replace-value').value;
  replaceLen = replaceValue.length;

  var completereplaceString = firstSpanContent + replaceValue + contentPage;
  console.log('firstpart:', firstSpanContent);
  console.log('--------');
  console.log('replace content:', replaceValue);
  console.log('--------');
  console.log('last content:', contentPage);

  prevfullcontent = completereplaceString;
  console.log('--------');
  console.log('--------');

  document.getElementById('inputTextToSave').value = prevfullcontent;
}

function SaveFileToServer() {
  var fileContent = document.getElementById('inputTextToSave').value;
  var newtest = '';
  for (var i = 1; i < pagecount; i++) {
    var contentnew = document.getElementById('inputTextToSave').value;

    newtest += contentnew;
    go_next(1);
  }
  go_first(0);

  var fileName = document.getElementById('hid_file').value;
  fileContent = SaveFileContent;

  var xhttp = new XMLHttpRequest();
  xhttp.open('PUT', 'http://localhost:5000/api/fileservice/filesave', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(
    JSON.stringify({
      fileName: fileName,
      fileContent: fileContent,
    })
  );
  var xhttp_ = new XMLHttpRequest();
  xhttp_.onreadystatechange = function () {
    // document.getElementById('inputTextToSave').value = this.responseText;
  };
  xhttp_.open(
    'GET',
    'http://localhost:5000/images/' +
      fileName +
      '?v' +
      Math.floor(Math.random() * 100),
    true
  );
  xhttp_.send();
}
