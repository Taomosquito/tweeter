$(document).ready(function() {
  $("#tweet-text").on("input", function(event) {
    const tweetLength = $(this).val().length;
    const tweetLengthRemaining = 140 - tweetLength;
    if (tweetLength > 140) {
      $(".counter").css("color", "red");
      $(".counter").html(`${tweetLengthRemaining}`);
    }
    if (tweetLength < 140) {
      $(".counter").css("color", "#545149");
      $(".counter").html(`${tweetLengthRemaining}`);
    }
  })
});
