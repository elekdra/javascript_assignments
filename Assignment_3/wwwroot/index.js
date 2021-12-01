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
var searchingContent;
var originallength;
var offset;
var searchendindex;
var fullfileContent = '';
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

          document.getElementById('searchnext').disabled = false;
          document.getElementById('inputTextToSave').value =
            content[cur_page].join(' ');
          searchingContent = document.getElementById('inputTextToSave').value;
          offset = 0;
          fullfileContent = '';
          searchstart = 0;
          searchendindex = searchingContent.length;
          originallength = searchingContent.length;
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
  searchingContent = document.getElementById('inputTextToSave').value;
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
  searchingContent = document.getElementById('inputTextToSave').value;
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
var searchingValue;
var searchValuestartIndex;
var searchingValueEndIndex;
var contenttoadd = '';
function SaveFileToServer() {
  console.log(cur_page);
  var fileContent = document.getElementById('inputTextToSave').value;
  var newtest = '';
  console.log(fullfileContent + fileContent);
  for (var i = cur_page + 1; i < pagecount; i++) {
    console.log(content[i].join(' '));
    contenttoadd += content[i].join(' ');
  }
  console.log(fullfileContent + fileContent + contenttoadd);

  fileContent = fullfileContent + fileContent + contenttoadd;

  var fileName = document.getElementById('hid_file').value;

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
    xhttp_.open(
      'GET',
      'http://localhost:5000/images/' +
        fileName +
        '?v' +
        Math.floor(Math.random() * 100),
      true
    );
    xhttp_.send();
  };
}

function HighLightContent() {
  var currenttextarea = document.getElementById('inputTextToSave').value;
  input = document.getElementById('inputTextToSave');
  input.focus();
  console.log('highlight starting is :', searchValuestartIndex + offset);
  input.setSelectionRange(
    searchValuestartIndex + offset,
    searchingValueEndIndex + offset
  );
  previousContent = currenttextarea.substring(
    0,
    searchingValueEndIndex + offset
  );
  console.log('previous content:', previousContent);
  offset += searchingValueEndIndex;
}
function FindtheWord() {
  console.log('searching content is:', searchingContent);
  searchingValue = document.getElementById('search-value').value;
  console.log('searching value is:', searchingValue);
  searchValuestartIndex = searchingContent.search(searchingValue);
  if (searchValuestartIndex != -1) {
    searchingValueEndIndex = searchValuestartIndex + searchingValue.length;
    HighLightContent();
    searchingContent = searchingContent.substring(
      searchingValueEndIndex,
      searchingContent.length
    );
  } else {
    fullfileContent += document.getElementById('inputTextToSave').value;

    go_next(1);

    searchingContent = document.getElementById('inputTextToSave').value;
    offset = 0;
  }
}
function FindAndReplace() {
  searchValue = document.getElementById('search-value').value;
  originallen = searchValue.length;
  var replaceValue = document.getElementById('replace-value').value;
  replaceLen = replaceValue.length;
  console.log(searchValue.length);
  console.log(previousContent.length);
  console.log(originallength);

  previousContent =
    previousContent.substring(0, previousContent.length - searchValue.length) +
    replaceValue;
  console.log('prev content:', previousContent);
  console.log('full text area:', previousContent + searchingContent);
  console.log('curren page:', cur_page);
  document.getElementById('inputTextToSave').value =
    previousContent + searchingContent;
  offset = offset - (searchingValue.length - replaceValue.length);
}
