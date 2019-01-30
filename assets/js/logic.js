var player1Wins = 0;
var player2Wins = 0;
var ties = 0;
var player1choice = "";
var player2choice = "";
var fighterChoice = "";
var ResetValue = false;


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCIu_TNarDqL4OgNSeYzeK3CjMbZUkk0iQ",
    authDomain: "rps-github.firebaseapp.com",
    databaseURL: "https://rps-github.firebaseio.com",
    projectId: "rps-github",
    storageBucket: "rps-github.appspot.com",
    messagingSenderId: "940810100976"
};
firebase.initializeApp(config);

var database = firebase.database();
var Player1Database = database.ref().child("Player1");
var Player2Database = database.ref().child("Player2");


Reset = function () {
    Player1Database.set({
        Choice: "Nothing",
        Wins: player1Wins
    })
    Player2Database.set({
        Choice: "Nothing",
        Wins: player2Wins
    })
    database.ref().child("Ties").set({
        Ties: ties
    })
    Show();
};

ResetGame = function () {
    Player1Database.set({
        Choice: "Nothing",
        Wins: 0
    })
    Player2Database.set({
        Choice: "Nothing",
        Wins: 0
    })
    database.ref().child("Ties").set({
        Ties: 0
    })
    $("#Rock1").hide();
    $("#Rock2").hide();
    $("#Paper1").hide();
    $("#Paper2").hide();
    $("#Scissors1").hide();
    $("#Scissors2").hide();
    $("#choose-fighter-1").show();
    $("#choose-fighter-2").show();
    fighterChoice = "";


};


Show = function () {
    if (fighterChoice === "Fighter1") {
        $("#Rock1").show();
        $("#Paper1").show();
        $("#Scissors1").show();
    };
    if (fighterChoice === "Fighter2") {
        $("#Rock2").show();
        $("#Paper2").show();
        $("#Scissors2").show();
    };
}

CheckWinner = function (player1choice, player2choice) {
    if (player2choice === "Nothing" && player1choice !== "Nothing") {
        if (fighterChoice === "Fighter1") {
            $("#Rock1").hide();
            $("#Paper1").hide();
            $("#Scissors1").hide();
        };
    };
    if (player2choice !== "Nothing" && player1choice === "Nothing") {
        if (fighterChoice === "Fighter2") {
            $("#Rock2").hide();
            $("#Paper2").hide();
            $("#Scissors2").hide();
        };
    };
    if (player2choice !== "Nothing" && player1choice !== "Nothing") {
        if (player1choice === player2choice) {
            ties++;
            Reset();
        } else if (player1choice === "Rock" && player2choice === "Scissors") {
            player1Wins++;
            Reset();
        } else if (player1choice === "Paper" && player2choice === "Rock") {
            player1Wins++;
            Reset();
        } else if (player1choice === "Scissors" && player2choice === "Paper") {
            player1Wins++;
            Reset();
        } else {
            player2Wins++;
            Reset();
        }
    };
};


database.ref().on("value", function (snapshot) {
    player1choice = snapshot.child("Player1").child("Choice").val();
    player2choice = snapshot.child("Player2").child("Choice").val();
    $("#player1-score").text(snapshot.child("Player1").child("Wins").val());
    $("#player2-score").text(snapshot.child("Player2").child("Wins").val());
    $("#ties-score").text(snapshot.child("Ties").child("Ties").val());
    CheckWinner(player1choice, player2choice);
});

database.ref().child("Reset").on("value", function (snapshot) {
    ResetGame();
    ResetValue = false;
    database.ref().child("Reset").set({
        Reset: ResetValue
    })
});

database.ref().child("Chat").on("child_added", function (snapshot) {
    var NewMessage = $("<p>");
    NewMessage.text(snapshot.val());
    NewMessage.attr('id', snapshot.key);
    $("#chat-text").prepend(NewMessage);
});


database.ref().child("Chat").on("child_removed", function (snapshot) {
    $("#chat-text").empty();
});





$("#Rock1").hide();
$("#Rock2").hide();
$("#Paper1").hide();
$("#Paper2").hide();
$("#Scissors1").hide();
$("#Scissors2").hide();


$(".option1").on("click", function () {
    var choice = $(this).text();
    Player1Database.set({
        Choice: choice,
        Wins: player1Wins
    })
    CheckWinner(player1choice, player2choice);
});
$(".option2").on("click", function () {
    var choice = $(this).text();
    Player2Database.set({
        Choice: choice,
        Wins: player2Wins
    })
    CheckWinner(player1choice, player2choice);
});


$("#ResetBtn").on("click", function () {
    ResetValue = true;
    database.ref().child("Reset").set({
        Reset: ResetValue
    });
});


$("#choose-fighter-1").on("click", function () {
    fighterChoice = "Fighter1";
    $("#choose-fighter-1").hide();
    $("#choose-fighter-2").hide();
    Show();
    Player1Database.set({
        Choice: "Nothing",
        Wins: player1Wins
    })
});

$("#choose-fighter-2").on("click", function () {
    fighterChoice = "Fighter2";
    $("#choose-fighter-1").hide();
    $("#choose-fighter-2").hide();
    Show();
    Player2Database.set({
        Choice: "Nothing",
        Wins: player2Wins
    })
});

$("#chat-input-text").keypress(function (e) {
    if (e.which == 13) {
        var NewChat = $("#chat-input-text").val();
        $("#chat-input-text").val("");
        database.ref().child("Chat").push(NewChat);
    }
    return;
});
$("#chat-input").on("click", function () {
    var NewChat = $("#chat-input-text").val();
    $("#chat-input-text").val("");
    database.ref().child("Chat").push(NewChat);
});
$("#chat-clear").on("click", function () {
    $("#chat-text").empty();
    var base = "try sending a message"
    database.ref().child("Chat").set({
        base: base
    });
});