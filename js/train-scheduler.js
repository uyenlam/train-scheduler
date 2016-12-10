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

//Initial variables

var trainName = "";
var trainDestination = "";
var firstTrain = "";
var trainFrequency = ""; //in minutes, so need to parseInt this value input
var currentTime = "";
var trainSched = [];

function nextArrival() {
    var lastTrain = firstTrain;

    function a(){
        var nextTrain = moment(lastTrain).add(trainFrequency, 'minutes');
        trainSched.push(nextTrain);
        console.log(trainSched);
    };
    a()
    $.when(a).done(function(){
        lastTrain = nextTrain;
        console.log(lastTrain);
        nextArrival();
    })
}

// function minutesAway {
//     currentTime = moment().format();
// }


$('#submit').on('click', function(){


    trainName = $('#train-name').val().trim();
    trainDestination = $('#train-destination').val().trim();
    firstTrain = moment($('#train-time').val().trim(),'hh:mm a A').format();
    trainFrequency = $('#train-frequency').val().trim();
    
    console.log(firstTrain);
    // nextArrival();

    // database.ref().push({
    //     trainName: trainName,
    //     trainDestination: trainDestination,
    //     firstTrain: firstTrain,
    //     trainFrequency: trainFrequency,
    //     dateAdded: firebase.database.ServerValue.TIMESTAMP,

    // });

    // //Don't refresh the page
    // return false;

});


database.ref().on('child_added', function(childSnapshot) {

    // all records after the last continue to invoke this function
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDestination);
    console.log(childSnapshot.val().firstTrain);
    console.log(childSnapshot.val().trainFrequency);
    console.log(childSnapshot.val().dateAdded);

    $('#train-info').append('<tr><td>' + trainName +
        '</td><td>' + trainDestination +'</td></tr>');



});

});