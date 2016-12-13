$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDz0cB-Ieq7AKhddOk3GXWLn-_Uv7pw9XE",
    authDomain: "train-scheduler-1f2e9.firebaseapp.com",
    databaseURL: "https://train-scheduler-1f2e9.firebaseio.com",
    storageBucket: "train-scheduler-1f2e9.appspot.com",
    messagingSenderId: "797137670578"
  };

firebase.initializeApp(config);

var database = firebase.database();

//Initial variables - These are used to push raw data to Firebase
//These are NOT necessarily used for calculation after retrieving data from Firebase

var trainName = "";
var trainDestination = "";
var firstTrain = "";
var trainFrequency = []; //in minutes, so need to parseInt this input before doing calculation


// variables used for storing information from Firebase 
var tName = "";
var tDestination = "";
var tFirst = "";
var tFrequency = "";
var tTimeAdded = "";

// variables used for calculation
var mTilltrain = [];
var nextTrain = [];


function calcTime() {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTconverted = moment(tFirst, "hh:mm").subtract(1, "years");
    console.log(firstTconverted);

    var currentTime = moment().format("hh:mm");
    console.log("Current time is: " + currentTime);

    var diffTime = moment().diff(moment(firstTconverted),"minutes");
    console.log("Difference in time: " + diffTime);

    //Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    //Minutes till train
    mTilltrain = tFrequency - tRemainder;
    console.log("Minutes till train: " + mTilltrain);

    //Next train
    nextTrain = moment().add(mTilltrain,"minutes");
    console.log("The next train is: " + moment(nextTrain).format("hh:mm"));

};


$('#submit').on('click', function(){


    trainName = $('#train-name').val().trim();
    trainDestination = $('#train-destination').val().trim();
    firstTrain = $('#train-time').val().trim();
    trainFrequency = $('#train-frequency').val().trim();

    database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        firstTrain: firstTrain,
        trainFrequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,

    });

});


database.ref().on('child_added', function(childSnapshot) {

    console.log(childSnapshot);

    tName = childSnapshot.val().trainName;
    tDestination = childSnapshot.val().trainDestination;
    tFirst = childSnapshot.val().firstTrain;
    tFrequency = parseInt(childSnapshot.val().trainFrequency);
    tTimeAdded = childSnapshot.val().dateAdded;

    calcTime();
    $.when(calcTime).done(function(){

        $('#train-info').append('<tr><td>' + tName +
        '</td><td>' + tDestination + 
        '</td><td>' + tFrequency + 
        '</td><td>' + nextTrain +
        '</td><td>' + mTilltrain + '</td></tr>');
    })


});

});