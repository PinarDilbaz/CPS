var data = {
  index: -1,
  timeStamp: -1,
  x: -1,
  y: -1,
  duration: -1,
  stimuliName: ' ',
  partID: -1
};

//this variable is used for returned object from database requests
var objectDB;

var fileData_Autistic = new Array();
var fileData_Control = new Array();
var counter_control = 0;
var counter_autistic = 0;
var ID_finder = 1;
var path_control = '';
var path_autistic = '';
var fileWrite = '';
var height = -1;
var width = -1;

var autistic_stimulis = new Array();
var control_stimulis = new Array();

var autistic_stimulis = new Array();
var control_stimulis = new Array();
var enable_control = 0;
var enable_autistic = 0;

var dropdown_autistic = 0;
var dropdown_control = 0;
var dropdown_stimulis = new Array();
var stimuli_array = new Array();

//Triggerred when a file is uploaded to Autistic Group in Modelling page, Input File Read
document.getElementById('inputfile').addEventListener('change', function() {
  autistic_stimulis = [];
  for (var z = 0; this.files.length > z; z++) {
    var reader = new FileReader();
    var fileData = new Array();
    reader.onload = FileDone;
    reader.readAsText(this.files[z]);
  }
  //dropdown print start
  if (dropdown_control == 1) {
    var select = document.getElementById("selectStimuli");
    for (var i = 0; i < stimuli_array.length; i++) {
      var opt = stimuli_array[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
    }
  }
  //dropdown print end
})

var FileDone = function(event) {
  var Part_finder = -1;
  var Part_index = -1;
  //enable inputs start
  enable_control = enable_control + 1;
  if (enable_autistic >= 1) {
    document.getElementById("model").disabled = false;
    //enable inputs end
  }


  counter_autistic = counter_autistic + 1;
  var fileContent = event.target.result;
  var lines = fileContent.split(/\n/);

  var fileHeaders = new Array();
  fileHeaders = lines[0].split(/\t/); //Stores (FixationIndex,Timestamp,FixationDuration,MappedFixationPointX,MappedFixationPointY,StimuliName)

  var tmp = -1;
  for (var i = 1; lines.length > i; i++) {

    var test = 1;
    var temp = lines[i].split(/\t/);
    if (temp != "") {
      temp[5] = temp[5].replace("\r", "");
      var addedAlready = 1;
      for (var jr = 0; jr < autistic_stimulis.length; jr++) {
        if (autistic_stimulis[jr] === temp[5]) {
          addedAlready = 0;
        }
      }
      if (addedAlready) {
        var len = autistic_stimulis.length;
        autistic_stimulis[len] = temp[5];
      }
      ID_finder = 0;
      Part_finder = 0;
      for (var j = 0; fileData_Autistic.length > j; j++) {
        if (fileData_Autistic[j][0][0].stimuliName === temp[5]) {
          for (var a = 0; a < fileData_Autistic[j].length; a++) {
            if (fileData_Autistic[j][a][0].partID === counter_autistic) {
              Part_finder = 1;
              Part_index = a;
            }
          }
          if (Part_finder == 1) { //If participant and stimuli name found in the array
            tmp = fileData_Autistic[j][Part_index].length;
            fileData_Autistic[j][Part_index][tmp] = new Object();
            fileData_Autistic[j][Part_index][tmp].x = temp[3];
            fileData_Autistic[j][Part_index][tmp].y = temp[4];
            fileData_Autistic[j][Part_index][tmp].duration = temp[2];
            fileData_Autistic[j][Part_index][tmp].stimuliName = temp[5];
            fileData_Autistic[j][Part_index][tmp].partID = counter_autistic;
            fileData_Autistic[j][Part_index][tmp].index = temp[0];
            fileData_Autistic[j][Part_index][tmp].timeStamp = temp[1];
            test = 0;
          } else { //If paticipant not found, but stimuli name found
            tmp = fileData_Autistic[j].length;
            fileData_Autistic[j][tmp] = new Array();
            fileData_Autistic[j][tmp][0] = new Object();
            fileData_Autistic[j][tmp][0].x = temp[3];
            fileData_Autistic[j][tmp][0].y = temp[4];
            fileData_Autistic[j][tmp][0].duration = temp[2];
            fileData_Autistic[j][tmp][0].stimuliName = temp[5];
            fileData_Autistic[j][tmp][0].partID = counter_autistic;
            fileData_Autistic[j][tmp][0].index = temp[0];
            fileData_Autistic[j][tmp][0].timeStamp = temp[1];
            test = 0;
          }
        }
      }
      if (test == 1) { //If simuli not found in the array
        tmp = fileData_Autistic.length;
        fileData_Autistic[tmp] = new Array();
        fileData_Autistic[tmp][0] = new Array();
        fileData_Autistic[tmp][0][0] = new Object();
        fileData_Autistic[tmp][0][0].x = temp[3];
        fileData_Autistic[tmp][0][0].y = temp[4];
        fileData_Autistic[tmp][0][0].duration = temp[2];
        fileData_Autistic[tmp][0][0].stimuliName = temp[5];
        fileData_Autistic[tmp][0][0].partID = counter_autistic;
        fileData_Autistic[tmp][0][0].index = temp[0];
        fileData_Autistic[tmp][0][0].timeStamp = temp[1];
      }
    }
    //console.log(fileData_Autistic);
  }
  if (ID_finder === 1) {
    counter_autistic = counter_autistic - 1;
  }
  ID_finder = 1;

  //dropdown stimuli array start
  dropdown_autistic = 1;
  for (var i = 0; i < autistic_stimulis.length; i++) {
    var found = 0;
    for (var j = 0; j < stimuli_array.length; j++) {
      if (stimuli_array[j] === autistic_stimulis[i]) {
        found = 1;
      }
    }
    if (found == 0) {
      var tempo = stimuli_array.length;
      stimuli_array[tempo] = autistic_stimulis[i];
    }
  }
  //dropdown stimuli array end
}

//Triggerred when a file is uploaded to Control Group in Modelling page, Input File Read
document.getElementById('inputfile1').addEventListener('change', function() {
  control_stimulis = [];
  for (var z = 0; this.files.length > z; z++) {
    var reader = new FileReader();
    var fileData = new Array();
    reader.onload = FileDone2;
    reader.readAsText(this.files[z]);
  }
  //dropdown print start
  if (dropdown_autistic == 1) {
    var select = document.getElementById("selectStimuli");
    for (var i = 0; i < stimuli_array.length; i++) {
      var opt = stimuli_array[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
    }
  }
  //dropdown print end
})

var FileDone2 = function(event) {
  var Part_finder = -1;
  var Part_index = -1;
  //enable input start
  enable_autistic = enable_autistic + 1;
  if (enable_control >= 1) {
    document.getElementById("model").disabled = false;
  }
  //enable input end

  counter_control = counter_control + 1;
  var fileContent = event.target.result;
  var lines = fileContent.split(/\n/);

  var fileHeaders = new Array();
  fileHeaders = lines[0].split(/\t/);

  var tmp = -1;
  for (var i = 1; lines.length > i; i++) {

    var test = 1;
    var temp = lines[i].split(/\t/);
    if (temp != "") {
      temp[5] = temp[5].replace("\r", "");
      var addedAlready = 1;
      for (var jr = 0; jr < control_stimulis.length; jr++) {
        if (control_stimulis[jr] === temp[5]) {
          addedAlready = 0;
        }
      }
      if (addedAlready) {
        var len = control_stimulis.length;
        control_stimulis[len] = temp[5];
      }

      ID_finder = 0;
      Part_finder = 0;
      //Array for input data starts
      for (var j = 0; fileData_Control.length > j; j++) {
        if (fileData_Control[j][0][0].stimuliName === temp[5]) {
          for (var a = 0; a < fileData_Control[j].length; a++) {
            if (fileData_Control[j][a][0].partID === counter_control) {
              Part_finder = 1;
              Part_index = a;
            }
          }
          if (Part_finder == 1) { //If participant and stimuli name found in the array
            tmp = fileData_Control[j][Part_index].length;
            fileData_Control[j][Part_index][tmp] = new Object();
            fileData_Control[j][Part_index][tmp].x = temp[3];
            fileData_Control[j][Part_index][tmp].y = temp[4];
            fileData_Control[j][Part_index][tmp].duration = temp[2];
            fileData_Control[j][Part_index][tmp].stimuliName = temp[5];
            fileData_Control[j][Part_index][tmp].partID = counter_control;
            fileData_Control[j][Part_index][tmp].index = temp[0];
            fileData_Control[j][Part_index][tmp].timeStamp = temp[1];
            test = 0;
          } else { //If paticipant not found, but stimuli name found
            tmp = fileData_Control[j].length;
            fileData_Control[j][tmp] = new Array();
            fileData_Control[j][tmp][0] = new Object();
            fileData_Control[j][tmp][0].x = temp[3];
            fileData_Control[j][tmp][0].y = temp[4];
            fileData_Control[j][tmp][0].duration = temp[2];
            fileData_Control[j][tmp][0].stimuliName = temp[5];
            fileData_Control[j][tmp][0].partID = counter_control;
            fileData_Control[j][tmp][0].index = temp[0];
            fileData_Control[j][tmp][0].timeStamp = temp[1];
            test = 0;
          }
        }
      }
      if (test == 1) { //If simuli not found in the array
        tmp = fileData_Control.length;
        fileData_Control[tmp] = new Array();
        fileData_Control[tmp][0] = new Array();
        fileData_Control[tmp][0][0] = new Object();
        fileData_Control[tmp][0][0].x = temp[3];
        fileData_Control[tmp][0][0].y = temp[4];
        fileData_Control[tmp][0][0].duration = temp[2];
        fileData_Control[tmp][0][0].stimuliName = temp[5];
        fileData_Control[tmp][0][0].partID = counter_control;
        fileData_Control[tmp][0][0].index = temp[0];
        fileData_Control[tmp][0][0].timeStamp = temp[1];
      }
    }
  }
  if (ID_finder === 1) {
    counter_control = counter_control - 1;
  }
  ID_finder = 1;
  //Array for input data ends
  //dropdown stimuli array start
  dropdown_control = 1;
  for (var i = 0; i < control_stimulis.length; i++) {
    var found = 0;
    for (var j = 0; j < stimuli_array.length; j++) {
      if (control_stimulis[i] === stimuli_array[j]) {
        found = 1;

      }
    }
    if (found == 0) {
      var tempo = stimuli_array.length;
      stimuli_array[tempo] = control_stimulis[i];
    }
  }
  //dropdown stimuli array end
}


//Comes here when create button is pressed in Modelling page
function read() {
  var stimuli_array = new Array();
  //Takes the inputs from the Modelling page
  var stimuli_name = document.getElementById("selectStimuli").value;
  var model_name = document.getElementById("model").value;
  var gridSizeX = document.getElementById("gridX").value;
  var gridSizeY = document.getElementById("gridY").value;
  var permission = document.getElementById("permission");
  var storePermit = false;
  if ($(permission).is(':checked')) {
    storePermit = true;
  }
  //Clears the input boxes contents in the Modelling page
  document.getElementById("model").value = "";
  document.getElementById("selectStimuli").value = "";

  if (fileData_Autistic.length) {
    var grid = addGrid(1);
    var path_autistic = sendSta(grid, stimuli_name, fileData_Autistic);
    durationsStr = '';
  }
  //If grid is already created, it is not created again. For this it sends 0.
  if (fileData_Control.length) {
    var grid = addGrid(0);
    var path_control = sendSta(grid, stimuli_name, fileData_Control);
    durationsStr = '';

    //create a flag for whether we store the model permanently or not
    var flag = 0;
    if (storePermit === true) flag = 1;

    //description column is used for image name
    var desc = "";
    const mymodel_image = document.querySelector('input[id="screenshot"]');

    //Create a FormData object to store all required data
    var formData = new FormData();
    formData.append('width', width);
    formData.append('height', height);
    formData.append('mymodel_image', mymodel_image.files[0]);
    formData.append('model_name', model_name);
    formData.append('stimuli_name', stimuli_name);
    formData.append('grid_x', gridSizeX);
    formData.append('grid_y', gridSizeY);
    formData.append('autistic_path', path_autistic);
    formData.append('control_path', path_control);
    formData.append('flag', flag);
    //formData.append('description', desc);

    //check model names from CPS database to be sure about uniqueness
    fetch('https://cpsrestfulapi.herokuapp.com/models', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(models => models.json())
      .then((json) => {
        var modelStr = JSON.stringify(json)

        const modelDB0 = JSON.parse(modelStr);
        var modelDB = modelDB0.results;
        //console.log(modelDB);
        //console.log(modelDB[1].model_name);


        var check = 0;
        var len = modelDB.length;

        for (var i = 0; i < len; i++) {
          if (modelDB[i].model_name === model_name) {
            check = 1;
            break;
          }
        }

        // if model name is unique, add a new row to CPS database Models table
        if (check === 0) {
          fetch('https://cpsrestfulapi.herokuapp.com/newModel', {
              method: 'POST',
              body: formData
            })
            .then(response => {
              return response.json()
            })
            .then(data => console.log(data))
            .catch(err => console.log(err));
        } else {
          alert("Model name is not unique!");
        }

      })
      .catch(err => console.log(err));
  }
}

var newComerData = new Array();
var myModel = "";
var unknownPathPrediction = "";


//Comes here when submit button is pressed in the Prediction page
function newComerRead(file) {
  unknownPath = '';
  unknownPathPrediction = "";
  newComerData = new Array();
  //If animation is running when new prediction is requested, it first stops the animation
  StopInterval();
  myModel = document.getElementById("selectModel").value;
  var reader = new FileReader();
  //newFile reading
  reader.onload = function(event) {
    var fileContent = event.target.result;
    var lines = fileContent.split(/\n/);

    var fileHeaders = new Array(); //Stores (FixationIndex,Timestamp,FixationDuration,MappedFixationPointX,MappedFixationPointY,StimuliName)
    fileHeaders = lines[0].split(/\t/);

    for (var i = 1; lines.length > i; i++) {
      var temp = lines[i].split(/\t/);
      if (temp != "") {
        var stimuliFound = 1;
        if (newComerData.length === 0) { //If array is empty
          newComerData[0] = new Array();
          newComerData[0][0] = new Object();
          newComerData[0][0].x = temp[3];
          newComerData[0][0].y = temp[4];
          newComerData[0][0].duration = temp[2];
          newComerData[0][0].stimuliName = temp[5];
        } else {
          for (var j = 0; j < newComerData.length; j++) {
            if (newComerData[j][0].stimuliName === temp[5]) {   //If array for this stimuli alread created
              tmp = newComerData[j].length;
              newComerData[j][tmp] = new Object();
              newComerData[j][tmp].x = temp[3];
              newComerData[j][tmp].y = temp[4];
              newComerData[j][tmp].duration = temp[2];
              newComerData[j][tmp].stimuliName = temp[5];
              stimuliFound = 0;
            }
          }
          if (stimuliFound) {
            tmp = newComerData.length;
            newComerData[tmp] = new Array();
            newComerData[tmp][0] = new Object();
            newComerData[tmp][0].x = temp[3];
            newComerData[tmp][0].y = temp[4];
            newComerData[tmp][0].duration = temp[2];
            newComerData[tmp][0].stimuliName = temp[5];
          }
        }
      }
    }
  };
  reader.readAsText(file.files[0]);
  document.getElementById("inputfile3").value = "";
  document.getElementById("selectModel").value = "";

  // check the text file to see whether selected model's stimuli name exists in it or not
  function isExist(stimuli) {
    var existence = 0;
    for (var i = 0; i < newComerData.length; i++) {
      var txt_stimuli = newComerData[i][0].stimuliName;
      console.log(txt_stimuli);
      if (stimuli.trim() === txt_stimuli.trim()) {
        existence = 1;
        break;
      }
    }
    return existence;
  }

  // get the requested model object from database by using its name
  var getDataURl = 'https://cpsrestfulapi.herokuapp.com/models/' + myModel;
  console.log(getDataURl);
  fetch(getDataURl)
    .then(model => model.json())
    .then((json) => {
      var objectStr = JSON.stringify(json);
      var objectDB0 = JSON.parse(objectStr);
      objectDB = objectDB0;
      width = objectDB[0].width;
      height = objectDB[0].height;

      var checkStimuli = isExist(objectDB[0].stimuli_name);
      console.log(checkStimuli);
      console.log(objectDB[0].stimuli_name);

      // if it does not exist, inform the user
      if (!checkStimuli) {
        var warning_msg = "Uploaded file does not contain " + myModel + "'s stimuli name."
        alert(warning_msg);
      }

      //if it exists, create its path and send it to the prediction
      else {
        singlePathCreator(width, height, objectDB[0].stimuli_name, objectDB[0].grid_x, objectDB[0].grid_y);
        prediction(unknownPathPrediction, objectDB[0].autistic_path, objectDB[0].control_path, objectDB[0].grid_x, objectDB[0].grid_y);

        // if model is not stored permanently, it will be deleted after the first use.
        if (objectDB[0].flag === 0) {
          /*var deleteImage = objectDB[0].description;
          var index = deleteImage.lastIndexOf(".");
          var deleteImageName = deleteImage.substring(0, index);
          var deleteImageNameExtension = deleteImage.substring(index + 1);
          var imageRemoveUrl = 'https://cpsrestfulapi.herokuapp.com/imageRemove/' + deleteImageName + "/" + deleteImageNameExtension;*/

          var public_id = objectDB[0].description.toString();
          var imageRemoveUrl = "https://cpsrestfulapi.herokuapp.com/deleteCloudinaryImage/" + public_id;

          // its stored image should also be deleted from the model-image file
          fetch(imageRemoveUrl, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
              return response.json()
            })
            .catch(err => console.log(err));

          // delete the model from CPS database Models table
          var modelRemoveURl = 'https://cpsrestfulapi.herokuapp.com/deleteModel/' + myModel;
          fetch(modelRemoveURl, {
              method: 'DELETE',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
              return response.json()
            })
            .catch(err => console.log(err));
        }
      }
    })

  //model drop down start
  function modelFunc(data, i) {

    if (data != 0) modelArray[i] = data;
    console.log("yeni");
    console.log(i);
    console.log(data.length);

    console.log(modelArray.length);
    for (var j = 0; j < modelArray.length; j++) console.log(modelArray[j]);

    if (data.length == 0) {
      var select = document.getElementById("selectModel");
      for (var j = 0; j < modelArray.length; j++) {
        var opt = modelArray[j];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
    }
  }
  //model drop down end

}

var grid = {
  index: -1,
  startX: -1,
  lengthX: -1,
  startY: -1,
  lengthY: -1,
  stimuli: ' '
};

// Creating Grids based on requested size
function addGrid(checker) {
  var gridSizeX = document.getElementById("gridX").value;
  var gridSizeY = document.getElementById("gridY").value;

  if (checker) { //Checks if we hae already write the width and heigth or not
    fileWrite = fileWrite.concat(width);
    fileWrite = fileWrite.concat(",");
    fileWrite = fileWrite.concat(height);
    fileWrite = fileWrite.concat(",");
  }
  var startX = 0;
  var startY = 0;
  var lengthX = 0;
  var lengthY = 0;

  var index = '';
  var indexCounter = 65;

  var Grids = [];

  // height and width values are calculated from uploaded image.
  for (var i = 0; i < gridSizeY; i++) {
    for (var j = 0; j < gridSizeX; j++) {
      startX = width * j / gridSizeX;
      lengthX = width * 1 / gridSizeX;
      startY = height * i / gridSizeY;
      lengthY = height * 1 / gridSizeY;
      index = String.fromCharCode(indexCounter);

      // Our AoI's are Grids that are created as objects. We keep them in an object array.
      Grids.push({
        index: index,
        startX: startX,
        lengthX: lengthX,
        startY: startY,
        lengthY: lengthY,
      });

      indexCounter++;
    }
  }
  return Grids;
}

var unknownPath = '';


//Creates single path for the new comer user
function singlePathCreator(width, height, stimuliUsed, gridSizeX, gridSizeY) {

  unknownPath = '';
  var startX = 0;
  var startY = 0;
  var lengthX = 0;
  var lengthY = 0;

  var index = '';
  var indexCounter = 65;

  var Grids = [];

  // Same process for generating the Grids array for unknown person's data process
  for (var i = 0; i < gridSizeY; i++) {
    for (var j = 0; j < gridSizeX; j++) {
      startX = width * j / gridSizeX;
      lengthX = width * 1 / gridSizeX;
      startY = height * i / gridSizeY;
      lengthY = height * 1 / gridSizeY;
      index = String.fromCharCode(indexCounter);

      Grids.push({
        index: index,
        startX: startX,
        lengthX: lengthX,
        startY: startY,
        lengthY: lengthY,
      });
      indexCounter++;
    }
  }
  var indexP;
  var indexFound = 0;
  for (var i = 0; i < newComerData.length; i++) {
    //REmoves new line at the end of the line
    newComerData[i][0].stimuliName = newComerData[i][0].stimuliName.replace('\r', '');
    if (newComerData[i][0].stimuliName === stimuliUsed) { //Finds the model stimuli's index in the new comer array
      indexP = i;
      indexFound = 1;
    }
  }
  if (indexFound) {
    for (var i = 0; i < newComerData[indexP].length; i++) {
      for (var j = 0; j < Grids.length; j++) {
        //Finds which x-y pair is in the which index one by one and creates a string path
        var op_y = Grids[j].startY + Grids[j].lengthY;
        var op_x = Grids[j].startX + Grids[j].lengthX;
        if ((Grids[j].startY <= newComerData[indexP][i].y) & (newComerData[indexP][i].y <= op_y) & (Grids[j].startX <= newComerData[indexP][i].x) & (newComerData[indexP][i].x <= op_x)) {
          unknownPath = unknownPath.concat(Grids[j].index);
          if (unknownPathPrediction.length > 0) { //Removes repetations
            var lastChar = unknownPathPrediction.length - 1;
            if (unknownPathPrediction[lastChar] != Grids[j].index) {
              unknownPathPrediction = unknownPathPrediction.concat(Grids[j].index);
            }
          } else {
            unknownPathPrediction = unknownPathPrediction.concat(Grids[j].index);
          }
        }
      }
    }
  }
}
var durationsStr = '';

//STA connection and response function
function sendSta(grid, stimuli, arr) {
  var indx = -1;
  var points = new Array();
  var rwData = {};
  var t;
  for (var i = 0; i < arr.length; i++) {
    arr[i][0][0].stimuliName = arr[i][0][0].stimuliName.replace("\r", "");
    if (arr[i][0][0].stimuliName === stimuli) { //Finds stimuli index in the array
      indx = i;
    }
  }
  //Creates STA's required default data
  for (var i = 0; i < arr[indx].length; i++) {
    for (var j = 0; j < arr[indx][i].length; j++) {
      var test = new vis.DataSet();
      var val = test.add(arr[indx][i][j]);
      if (j === 0) {
        var is = false;
      } else if (arr[indx][i][j].stimuliName === arr[indx][i][j - 1].stimuliName) {
        var is = true;
      } else {
        var is = false;
      }
      var data = {
        index: arr[indx][i][j].index,
        isConnected: is,
        id: val,
        participantID: arr[indx][i][j].partID,
        timestamp: arr[indx][i][j].timeStamp,
        fixDuration: arr[indx][i][j].duration,
        posX: arr[indx][i][j].x,
        posY: arr[indx][i][j].y,
        stimuliName: arr[indx][i][j].stimuliName
      }
      points[j] = data;
    }
    t = i + 1;
    rwData[t] = points;
    points = [];
  }
  //Sets parameters for STA
  var daccuracy = document.getElementById("daccuracy").value;
  var sizeOfScreen = document.getElementById("screenSize").value;
  var distance = document.getElementById("distance").value;
  var tlevel = document.getElementById("Tolarance").value;
  var hfidelity = document.getElementById("fidelity");
  var h_fidelity = false;
  if ($(fidelity).is(':checked')) {
    h_fidelity = true;
  }
  var setting = {
    sta: {
      daccuracy: daccuracy,
      sizeOfScreen: sizeOfScreen,
      distance: distance,
      resX: width,
      resY: height,
      tlevel: tlevel,
      hfidelity: h_fidelity
    },
    staAddress: "https://senasunar.pythonanywhere.com"
  };

  var postData = {
    areaData: grid,
    rawData: rwData,
    settings: setting.sta
  };

  var jsondata = JSON.stringify(postData);


  var dataResponse;
  //STA connection
  $.ajax({
    type: "POST",
    url: setting["staAddress"],
    data: {
      jsondata: jsondata
    },
    crossDomain: true,
    success: function(response) {
      dataResponse = response;
    },
    async: false
  });
  //Takes STA response
  dataResponse = JSON.parse(dataResponse);
  dataResponse = JSON.stringify(dataResponse);
  //Creates path string and durations array from the STA response
  if (dataResponse != " ") {
    var respond = dataResponse;
    respond = respond.split('[');
    path = "";
    path = path.concat(respond[1][1]);
    for (var xr = 5; xr < respond[1].length; xr = xr + 4) {
      path = path.concat(respond[1][xr]);
      path = path.replaceAll('"', '');
    }
    durations = respond[2].split(',');
    t_mp = durations.length - 1;
    durations[t_mp] = durations[t_mp].replaceAll(']', '');
    for (var xr = 0; xr < durations.length; xr++) {
      durationsStr = durationsStr.concat(String(durations[xr]) + " ");
    }
  }
  return path;
}

// calculating the difference between two strings
function levenshtein(a, b) {
  console.log("a: " + a);
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

var result = '';
var similarityRate_A, similarityRate_C;

// We make the path comparisons between unknown-autistic and unknown-control.
// Then we compare these two results to make a prediction. Result is sent to the visualization.
function prediction(unknown, autistic, control, gridX, gridY) {
  result = '';
  printResult = '';
  var comparisonUnknownAutistic = levenshtein(unknown, autistic);
  var comparisonUnknownControl = levenshtein(unknown, control);

  // Similarity rate is calculated based on the necessary changes and longer string's length
  var similarityRate;
  similarityRate_A = 1 - (comparisonUnknownAutistic / Math.max(unknown.length, autistic.length));
  similarityRate_C = 1 - (comparisonUnknownControl / Math.max(unknown.length, control.length));

  if (comparisonUnknownControl < comparisonUnknownAutistic) {
    console.log("CONTROL " + similarityRate_C);
    similarityRate_C = 100 * similarityRate_C;
    result = result.concat("Control," + similarityRate_C);
  } else if (comparisonUnknownAutistic < comparisonUnknownControl) {
    console.log("AUTISTIC " + similarityRate_A);
    similarityRate_A = 100 * similarityRate_A;
    result = result.concat("Autistic," + similarityRate_A);
  } else {
    similarityRate = 1 - (comparisonUnknownAutistic / Math.max(unknown.length, autistic.length));
    console.log("SYSTEM CANNOT DECIDE " + similarityRate);
    similarityRate = 100 * similarityRate;
    result = result.concat("System Cannot Decide," + similarityRate);
  }
  tmp = result.split(",");
  tmp[1] = tmp[1].substring(0, 4);
  visualize(unknownPath, autistic, control, gridX, gridY);
}

// Disable the submit button of Modeling until all boxes are filled and all inputs are selected
$(document).ready(function() {
  validate();
  $('#inputfile, #inputfile1, #model, #stimuli').change(validate);
});

function validate() {
  if ($('#inputfile').val().length > 0 &&
    $('#inputfile1').val().length > 0 &&
    $('#model').val().length > 0 &&
    $('#selectStimuli').val().length > 0) {
    $('#create').prop("disabled", false);
  } else {
    $('#create').prop("disabled", true);
  }
}

// Calculate the size of the uploaded image before submit
document.getElementById("screenshot").addEventListener('change', function() {
  //Read the contents of Image File.
  var reader = new FileReader();

  reader.onload = ImageDone;

  //Initiate the JavaScript Image object.
  var image = new Image();

  //Validate the File Height and Width.

  reader.readAsDataURL(this.files[0]);
})

var ImageDone = function(event) {
  var image = new Image();
  image.onload = function() {
    height = image.height;
    width = image.width;
  };
  image.src = event.target.result;
};
var myInterval;

function StopInterval() {
  clearInterval(myInterval); //Stops visualization animation
}


var container;
var network;
var nodes;
var edges;
var startNode = new Array();
var n = new Array();
var e = new Array();
var indexHolder = new Array();
var gridX_c;
var gridY_c;

//Visualisation
function visualize(unknown, autistic, control, gridX, gridY) {
  n = [];   //nodes array
  e = [];   //edges array
  //Sets checkboxes under the visualization as checked
  document.getElementById("autisticBox").checked = true;
  document.getElementById("controlBox").checked = true;
  document.getElementById("unknownBox").checked = true;
  document.getElementById("output").style.display = "block";
  window.scrollTo(1000, document.body.scrollHeight);  //scrolls the window for result
  startNode = new Array();
  var startEdge = new Array();
  container = document.getElementById("mynetwork");
  var bckgrnd = objectDB[0].image_path;
  /*bckgrnd = bckgrnd.split("\\");
  var wrtPrmt = 0;
  //Edits for background path coming from database
  var backgroundSet = '';
  for (var qw = 0; qw < bckgrnd.length; qw++) {
    if (bckgrnd[qw] === "CPS") {
      backgroundSet = backgroundSet.concat("\\localhost/CPS");
      wrtPrmt = 1;
    }
    if (wrtPrmt & bckgrnd[qw] != "CPS") {
      backgroundSet = backgroundSet.concat(bckgrnd[qw]);
    }
    if (qw != bckgrnd.length - 1) {
      backgroundSet = backgroundSet.concat("/");
    }
  }*/
  //Sets visualization background
  container.style.backgroundImage = "url('" + bckgrnd + "')";
  var h = height;
  var w = width;
  //If background image is too big
  if (w > 1000) {
    h = h / 2;
    w = w / 2;
  }
  if (h > 1000) {
    h = h / 2;
    w = w / 2;
  }
  container.style.height = h;
  container.style.width = w;

  var margin = w / 2;

  //Sets checkboxes posisitons
  document.getElementById("autisticBox").style.margin = "0px 0px 0px " + (margin - 180) + "px";
  document.getElementById("speedLabel").style.margin = "0px 0px 0px " + (margin - 122) + "px";

  var rowLength = h / parseInt(gridX);
  var columnLength = w / parseInt(gridY);
  gridX_c = parseInt(gridX);
  gridY_c = parseInt(gridY);
  index = 1;
  startNode[0] = index; //Holds autistic path start node index
  indexHolder[0] = index;

  //Creates visual path for autistic
  for (var i = 0; i < autistic.length; i++) {
    //Converts string chars to row and column numbers
    var num = autistic.charCodeAt(i);
    num = num - 65;
    var hh = parseInt(gridY);
    var row = num / hh;
    row = Math.floor(row);
    var g = parseInt(gridY);
    var column = num % g;
    //Finds x-y coordinates randomly in an AOI
    var y = row * rowLength + Math.floor(Math.random() * rowLength);
    var x = column * columnLength + Math.floor(Math.random() * columnLength);
    if (index == startNode[0]) { //Creates node
      n.push({
        id: index,
        x: x,
        y: y,
        color: "#D20606",
        border: '#6E1515',
        size: 10,
      });
    } else {
      n.push({
        id: index,
        x: x,
        y: y,
        color: "#D20606",
        size: 5,
      });
    }
    e.push({  //Creates edge
      id: index,
      from: (index - 1),
      to: index,
      color: {
        color: "#D20606",
      },
    });
    index++;
  }
  startNode[1] = index; //Holds control path start node index
  indexHolder[1] = index;
  //Does the same steps as autistic path
  for (var i = 0; i < control.length; i++) {
    var num = control.charCodeAt(i);
    num = num - 65;
    var hh = parseInt(gridY);
    var row = num / hh;
    row = Math.floor(row);
    var g = parseInt(gridY);
    var column = num % g;
    var y = row * rowLength + Math.floor(Math.random() * rowLength);
    var x = column * columnLength + Math.floor(Math.random() * columnLength);
    if (index == startNode[1]) {
      n.push({
        id: index,
        x: x,
        y: y,
        color: '#093E91',
        border: '#000306',
        size: 10,
      });
    } else {
      n.push({
        id: index,
        x: x,
        y: y,
        color: '#093E91',
        size: 5,
      });
    }
    if (index != startNode[1]) {
      var t = {
        id: index,
        from: (index - 1),
        to: index,
        color: {
          color: "#093E91",
        },
      }
      e.push(t);
    }
    index++;
  }
  startNode[2] = index; //Holds control path start node index
  indexHolder[2] = index;
  //Does the same steps as autistic path
  for (var i = 0; i < unknown.length; i++) {
    var num = unknown.charCodeAt(i);
    num = num - 65;
    var hh = parseInt(gridY);
    var row = num / hh;
    row = Math.floor(row);
    var g = parseInt(gridY);
    var column = num % g;
    var y = row * rowLength + Math.floor(Math.random() * rowLength);
    var x = column * columnLength + Math.floor(Math.random() * columnLength);
    if (index == startNode[2]) {
      n.push({
        id: index,
        x: x,
        y: y,
        color: '#15910A',
        border: '#1C6E15',
        size: 10,
      });
    } else {
      n.push({
        id: index,
        x: x,
        y: y,
        color: '#15910A',
        size: 5,
      });
    }
    if (index != startNode[2]) {
      e.push({
        id: index,
        from: (index - 1),
        to: index,
        color: {
          color: "#15910A",
        },
      });
    }
    index++;
  }
  startNode[3] = index; //Holds grid start node index
  indexHolder[3] = index;
  //Creates the grid
  for (var i = 0; i < parseInt(gridX); i++) {
    for (var j = 0; j < parseInt(gridY); j++) {
      index++;
      var y = i * rowLength;
      var x = j * columnLength;
      n.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00", //Grids nodes are invisible
        size: 25,
      })
      index++;
      var y = i * rowLength + rowLength;
      var x = j * columnLength;
      n.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00", //Grids nodes are invisible
        size: 25,
      })
      e.push({    //Only the edges are visible
        from: (index - 1),
        to: (index),
        width: 4,
        arrows: {
          to: {
            enabled: false,
          }
        },
        color: {
          color: "#606F74",
        },
      })
      index++;
      var y = i * rowLength;
      var x = j * columnLength;
      //Last column of the grid starts
      n.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00",
        size: 25,
      })
      index++;
      var y = i * rowLength;
      var x = j * columnLength + columnLength;
      n.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00",
        size: 25,
      })
      e.push({
        from: (index),
        to: (index - 1),
        width: 4,
        arrows: {
          to: {
            enabled: false,
          }
        },
        color: {
          color: "#606F74",
        },
      })
    }
    index++;
    n.push({
      id: index,
      x: x,
      y: y + rowLength,
      color: "#ffffff00",
      size: 25,
    })
    e.push({
      from: (index),
      to: (index - 1),
      width: 4,
      arrows: {
        to: {
          enabled: false,
        }
      },
      color: {
        color: "#606F74",
      },
    })
  }
  index++;
  var y = (parseInt(gridX)) * rowLength;
  var x = (parseInt(gridY)) * columnLength;
  n.push({
    id: index,
    x: x,
    y: y,
    color: "#ffffff00",
    size: 25,
  })
  e.push({
    from: (index),
    to: (index - 4),
    width: 4,
    arrows: {
      to: {
        enabled: false,
      }
    },
    color: {
      color: "#606F74",
    },
  })

  for (var i = 0; i < gridY - 1; i++) {
    index = index - 4;
    e.push({
      from: (index),
      to: (index - 4),
      width: 4,
      arrows: {
        to: {
          enabled: false,
        }
      },
      color: {
        color: "#606F74",
      },
    })
  }
  index++;
  //Last column of the grid ends
  startNode[4] = index;


  nodes = new vis.DataSet(n);
  edges = new vis.DataSet(e);

  container = document.getElementById("mynetwork");

  var data = {    //Creates visualization data
    nodes: nodes,
    edges: edges,
  }
  var options = {   //Creates visualization settings
    nodes: {
      shape: "dot",
      size: 5,
      fixed: {
        y: true,
        x: true,
      },

      font: {
        size: 32,
        color: "#ffffff",
      },
      borderWidth: 2,
    },
    edges: {
      width: 2,
      smooth: {
        type: "vertical",
        forceDirection: "none",
        roundness: 1,
      },
      arrows: {
        to: {
          enabled: true,
        }
      }
    },

    physics: false,
    interaction: {
      dragNodes: true, // do not allow dragging nodes
      zoomView: false, // do not allow zooming
      dragView: false // do not allow dragging
    }
  };
  //Puts visualization
  network = new vis.Network(container, data, options);
  var scaleOption = {
    scale: 1
  };
  network.moveTo(scaleOption);
  //Prediction result writing to HTML part starts
  if (document.getElementById("element")) {
    var tempElem = document.getElementById("element");
    tempElem.remove();
  }
  var element = document.createElement("div");
  element.setAttribute("id", "element");
  var tempArray = result.split(",");
  if (tempArray[0] === "Control") {
    element.appendChild(document.createTextNode("Result: " + tempArray[0] + " (Not-Autistic)"));
  } else {
    element.appendChild(document.createTextNode("Result: " + tempArray[0]));
  }
  element.appendChild(document.createElement('br'));
  element.appendChild(document.createElement('br'));
  element.appendChild(document.createTextNode("Similarity to Control (Not Autistic) Group: %" + similarityRate_C.toFixed(2)));
  element.appendChild(document.createElement('br'));
  element.appendChild(document.createTextNode("Similarity to Autistic Group: %" + similarityRate_A.toFixed(2)));
  element.style.color = "white";
  element.style.fontSize = "24px";
  if (parseInt(objectDB[0].width) > 1000) {
    var pl = parseInt(objectDB[0].width) / 2 + 100;
    var pl2 = -parseInt(objectDB[0].height) / 4 - 130;;
  } else {
    var pl = parseInt(objectDB[0].width) + 100;
    var pl2 = -parseInt(objectDB[0].height) / 2 - 130;;
  }
  element.style.margin = pl2.toString() + "px 0px 0px " + pl.toString() + "px";
  document.getElementById('output').appendChild(element);
  //Prediction result writing to HTML part ends
}

//Comes here when a checkbox is checked or unchecked
function displayCustomizedPaths() {
  var nn = new Array();
  var ee = new Array();
  var i_tracker = 0;
  index = 1;
  StopInterval(); //If animation is running, stops it first
  //Same settings as before
  var h = objectDB[0].height;
  var w = objectDB[0].width;
  if (w > 1000) {
    h = h / 2;
    w = w / 2;
  }
  if (h > 1000) {
    h = h / 2;
    w = w / 2;
  }
  var rowLength = h / parseInt(objectDB[0].grid_x);
  var columnLength = w / parseInt(objectDB[0].grid_y);
  var gridX = objectDB[0].grid_x;
  gridX_c = gridX;
  var gridY = objectDB[0].grid_y;
  gridY_c = gridY;

  //Takes checkbox values
  var autisticCheckBox = document.getElementById("autisticBox");
  var controlCheckBox = document.getElementById("controlBox");
  var unknownCheckBox = document.getElementById("unknownBox");
  startNode[0] = -1;
  if ($(autisticCheckBox).is(':checked')) {
    startNode[0] = index;
    //Same as the visualize() function
    for (var i = 0; i < objectDB[0].autistic_path.length; i++) {
      var num = objectDB[0].autistic_path.charCodeAt(i);
      num = num - 65;
      var hh = parseInt(gridY);
      var row = num / hh;
      row = Math.floor(row);
      var g = parseInt(gridY);
      var column = num % g;
      var y = n[indexHolder[0] + i - 1].y;
      var x = n[indexHolder[0] + i - 1].x;
      if (index == startNode[0]) {
        nn.push({
          id: index,
          x: x,
          y: y,
          color: "#D20606",
          border: '#6E1515',
          size: 10,
        });
      } else {
        nn.push({
          id: index,
          x: x,
          y: y,
          color: "#D20606",
          size: 5,
        });
      }
      ee.push({
        id: index,
        from: (index - 1),
        to: index,
        color: {
          color: "#D20606",
        },
      });
      index++;
    }
  }
  startNode[1] = -1;
  //Same as the visualize() function
  if ($(controlCheckBox).is(':checked')) {
    startNode[1] = index;
    for (var i = 0; i < objectDB[0].control_path.length; i++) {
      var num = objectDB[0].control_path.charCodeAt(i);
      num = num - 65;
      var hh = parseInt(gridY);
      var row = num / hh;
      row = Math.floor(row);
      var g = parseInt(gridY);
      var column = num % g;
      var y = n[indexHolder[1] + i - 1].y;
      var x = n[indexHolder[1] + i - 1].x;
      if (index == startNode[1]) {
        nn.push({
          id: index,
          x: x,
          y: y,
          color: '#093E91',
          border: '#000306',
          borderWidth: 2,
          size: 10,
        });
      } else {
        nn.push({
          id: index,
          x: x,
          y: y,
          color: '#093E91',
          size: 5,
        });
      }
      if (index != startNode[1]) {
        var t = {
          id: index,
          from: (index - 1),
          to: index,
          color: {
            color: "#093E91",
          },
        }
        ee.push(t);
      }
      index++;
    }
  }
  startNode[2] = -1;
  //Same as the visualize() function
  if ($(unknownCheckBox).is(':checked')) {
    startNode[2] = index;
    for (var i = 0; i < unknownPath.length; i++) {
      var num = unknownPath.charCodeAt(i);
      num = num - 65;
      var hh = parseInt(gridY);
      var row = num / hh;
      row = Math.floor(row);
      var g = parseInt(gridY);
      var column = num % g;
      var y = n[indexHolder[2] + i - 1].y;
      var x = n[indexHolder[2] + i - 1].x;
      if (index == startNode[2]) {
        nn.push({
          id: index,
          x: x,
          y: y,
          color: '#15910A',
          border: '#1C6E15',
          size: 10,
        });
      } else {
        nn.push({
          id: index,
          x: x,
          y: y,
          color: '#15910A',
          size: 5,
        });
      }
      if (index != startNode[2]) {
        ee.push({
          id: index,
          from: (index - 1),
          to: index,
          color: {
            color: "#15910A",
          },
        });
      }
      index++;
    }
  }
  startNode[3] = index;
//Same as the visualize() function
  for (var i = 0; i < parseInt(gridX); i++) {
    for (var j = 0; j < parseInt(gridY); j++) {
      index++;
      var y = i * rowLength;
      var x = j * columnLength;
      nn.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00",
        size: 25,
      })
      index++;
      var y = i * rowLength + rowLength;
      var x = j * columnLength;
      nn.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00",
        size: 25,
      })
      ee.push({
        from: (index - 1),
        to: (index),
        width: 4,
        arrows: {
          to: {
            enabled: false,
          }
        },
        color: {
          color: "#606F74",
        },
      })
      index++;
      var y = i * rowLength;
      var x = j * columnLength;
      nn.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00",
        size: 25,
      })
      index++;
      var y = i * rowLength;
      var x = j * columnLength + columnLength;
      nn.push({
        id: index,
        x: x,
        y: y,
        color: "#ffffff00",
        size: 25,
      })
      ee.push({
        from: (index),
        to: (index - 1),
        width: 4,
        arrows: {
          to: {
            enabled: false,
          }
        },
        color: {
          color: "#606F74",
        },
      })
    }
    index++;
    nn.push({
      id: index,
      x: x,
      y: y + rowLength,
      color: "#ffffff00",
      size: 25,
    })
    ee.push({
      from: (index),
      to: (index - 1),
      width: 4,
      arrows: {
        to: {
          enabled: false,
        }
      },
      color: {
        color: "#606F74",
      },
    })
  }
  index++;
  var y = (parseInt(gridX)) * rowLength;
  var x = (parseInt(gridY)) * columnLength;
  nn.push({
    id: index,
    x: x,
    y: y,
    color: "#ffffff00",
    size: 25,
  })
  ee.push({
    from: (index),
    to: (index - 4),
    width: 4,
    arrows: {
      to: {
        enabled: false,
      }
    },
    color: {
      color: "#606F74",
    },
  })
  for (var i = 0; i < gridY - 1; i++) {
    index = index - 4;
    ee.push({
      from: (index),
      to: (index - 4),
      width: 4,
      arrows: {
        to: {
          enabled: false,
        }
      },
      color: {
        color: "#606F74",
      },
    })
  }

  nodes = new vis.DataSet(nn);
  edges = new vis.DataSet(ee);

  container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  }
  var options = {
    width: w + 'px',
    height: h + 'px',
    nodes: {
      shape: "dot",
      size: 5,
      fixed: {
        y: true,
        x: true,
      },

      font: {
        size: 32,
        color: "#ffffff",
      },
      borderWidth: 2,
    },
    edges: {
      width: 2,
      smooth: {
        type: "vertical",
        forceDirection: "none",
        roundness: 1,
      },
      arrows: {
        to: {
          enabled: true,
        }
      }
    },

    physics: false,
    interaction: {
      dragNodes: false, // do not allow dragging nodes
      zoomView: false, // do not allow zooming
      dragView: false // do not allow dragging
    }
  };
  network = new vis.Network(container, data, options); //Creates visualization
  var scaleOption = {
    scale: 1
  };
  network.moveTo(scaleOption);
  //Same as the visualize() function
  var tempElem = document.getElementById("element");
  tempElem.remove();
  var element = document.createElement("div");
  element.setAttribute("id", "element");
  var tempArray = result.split(",");
  element.appendChild(document.createTextNode("Result: " + tempArray[0] + " Group"));
  element.appendChild(document.createElement('br'));
  element.appendChild(document.createElement('br'));
  element.appendChild(document.createTextNode("Similarity to Control Group: %" + similarityRate_C.toFixed(2)));
  element.appendChild(document.createElement('br'));
  element.appendChild(document.createTextNode("Similarity to Autistic Group: %" + similarityRate_A.toFixed(2)));
  element.style.color = "white";
  element.style.fontSize = "24px";
  if (parseInt(objectDB[0].width) > 1000) {
    var pl = parseInt(objectDB[0].width) / 2 + 100;
    var pl2 = -parseInt(objectDB[0].height) / 4 - 130;;
  } else {
    var pl = parseInt(objectDB[0].width) + 100;
    var pl2 = -parseInt(objectDB[0].height) / 2 - 130;
  }
  console.log(pl + " " + pl2);
  element.style.margin = pl2.toString() + "px 0px 0px " + pl.toString() + "px";
  document.getElementById('output').appendChild(element);
}


//Comes here when animate button is pressed in the prediction page
function animation() {
  //First makes all nodes and edges invisible
  for (t = 1; t < startNode[3]; t++) {
    nodes.update({
      id: t,
      color: "#ffffff00"
    });
    network.body.data.edges.clear({
      id: t
    });
  }
  var tmp_index = startNode[3];
  //Only grid is invisible
  //Grid creation starts
  for (var i = 0; i < parseInt(gridX_c); i++) {
    for (var j = 0; j < parseInt(gridY_c); j++) {
      tmp_index++;
      tmp_index++;
      network.body.data.edges.add([{
        from: tmp_index,
        to: parseInt(tmp_index) - 1,
        color: {
          color: "#606F74"
        },
        hidden: false,
        width: 4,
        arrows: {
          to: {
            enabled: false,
          }
        },
      }]);
      tmp_index++;
      tmp_index++;
      network.body.data.edges.add([{
        from: tmp_index,
        to: parseInt(tmp_index) - 1,
        color: {
          color: "#606F74"
        },
        hidden: false,
        width: 4,
        arrows: {
          to: {
            enabled: false,
          }
        },
      }]);
    }
    tmp_index++;
    network.body.data.edges.add([{
      from: tmp_index,
      to: parseInt(tmp_index) - 1,
      color: {
        color: "#606F74"
      },
      hidden: false,
      width: 4,
      arrows: {
        to: {
          enabled: false,
        }
      },
    }]);
  }
  tmp_index++;

  network.body.data.edges.add([{
    from: tmp_index,
    to: (parseInt(tmp_index) - 4),
    color: {
      color: "#606F74"
    },
    hidden: false,
    width: 4,
    arrows: {
      to: {
        enabled: false,
      }
    },
  }]);
  for (var i = 0; i < gridY_c - 1; i++) {
    tmp_index = tmp_index - 4;
    network.body.data.edges.add([{
      from: tmp_index,
      to: (parseInt(tmp_index) - 4),
      color: {
        color: "#606F74"
      },
      hidden: false,
      width: 4,
      arrows: {
        to: {
          enabled: false,
        }
      },
    }]);
  }
  //Grid creation ends
  StopInterval(); //Stops if there is a running animation
  //Takes and stores autistic, control, unknown nodes start indexes
  var i = startNode[0];
  var j = startNode[1];
  var k = startNode[2];
  var i_end = startNode[1];
  var j_end = startNode[2];
  if (i_end == -1 && j_end == -1) {
    i_end = startNode[3];
  } else if (i_end == -1) {
    i_end = startNode[2];
  } else if (j_end == -1) {
    j_end = startNode[3];
  }
  var mySpeed = document.getElementById("speedValue").value;
  mySpeed = mySpeed * 1000 //Convert to milliseconds
  myInterval = setInterval(function() {
    //Animation stop condition
    if (((i === i_end) || (i == -1)) && ((j === j_end) || (j == -1)) && ((k === startNode[3]) || (k == -1))) {
      nodes.update({
        id: i,
        size: 5,
        color: "#D20606"
      });
      nodes.update({
        id: j,
        size: 5,
        color: "#093E91"
      });
      nodes.update({
        id: k,
        size: 5,
        color: "#15910A"
      });
      StopInterval();
    } else {
      if ((i != i_end - 1) && (i != -1)) {
        if (i == startNode[0])   //Makes nodes visible one by one and creates edges for autistic until control start node index is reached
          nodes.update({
            id: i,
            color: "#D20606",
            size: 10
          });
        else
          nodes.update({
            id: i,
            color: "#D20606",
            size: 5
          });
        nodes.update({
          id: i + 1,
          color: "#D20606",
          size: 15
        });
        network.body.data.edges.add([{
          from: i,
          to: i + 1,
          color: {
            color: "#D20606"
          },
          hidden: false
        }]);
        i = i + 1;
      }
      if ((j != j_end - 1) && (j != -1)) {
        if (j == startNode[1])  //Makes nodes visible one by one and creates edges for control until unknown start node index is reached
          nodes.update({
            id: j,
            color: "#093E91",
            size: 10
          });
        else
          nodes.update({
            id: j,
            color: "#093E91",
            size: 5
          });
        nodes.update({
          id: j + 1,
          color: "#093E91",
          size: 15
        });
        network.body.data.edges.add([{
          from: j,
          to: j + 1,
          color: {
            color: "#093E91"
          },
          hidden: false
        }]);
        j = j + 1;
      }
      if ((k != startNode[3] - 1) && (k != -1)) {
        if (k == startNode[2])  //Makes nodes visible one by one and creates edges for unknown until grid start node index is reached
          nodes.update({
            id: k,
            color: "#15910A",
            size: 10
          });
        else
          nodes.update({
            id: k,
            color: "#15910A",
            size: 5
          });
        nodes.update({
          id: k + 1,
          color: "#15910A",
          size: 15
        });
        network.body.data.edges.add([{
          from: k,
          to: k + 1,
          color: {
            color: "#15910A"
          },
          hidden: false
        }]);
        k = k + 1;
      }
      network.redraw;
    }
  }, mySpeed);  //Runs this part every mySpeed seconds until StopInterval() is called.
}
