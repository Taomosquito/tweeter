/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {
  const $tweetsContainer = $('#tweets-container');

  // defines global error message behaviour hence the G notation at end.
  let errorMessageG = '';
  $('#error-message').slideUp().css('display', 'none');

  /* 
  Implements a function:
   * This function will primarily be called when rendering tweets
   * This function has the purpose of creating the new tweet HTML using jQuery
  */
  const createTweetElement = function(randomObject) {
    const formattedTime = timeago.format(randomObject.created_at);
    let $tweet = $(`
    <article class="tweet">
    <header>
    <div class="tweet-topLeft">
    <img src="${randomObject.user.avatars}" alt="">  
    <p class="user-name"></p>
    </div>
      <p class="greyOut user-handle"></p>
    </header>
    <section class="tweet-content">
    </section>
    <hr />
    <footer>
      <p>created: ${formattedTime}</p>
      <footer class="icons">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </footer>
    `);
    // These are to prevent XSS
    $tweet.find(".user-name").text(randomObject.user.name);
    $tweet.find(".greyOut.user-handle").text(randomObject.user.handle);
    $tweet.find(".tweet-content").text(randomObject.content.text);

    return $tweet;
  }

  /*
  Implements a function:
    * This function will be used to reset container status.
    * This function will be used to attach all new tweets to the page.
  */
  const renderTweets = function(randomObjectArr) {
    $tweetsContainer.empty();
    for (singleObject of randomObjectArr) {
      let $renderedTweet = createTweetElement(singleObject);
      $tweetsContainer.prepend($renderedTweet);
    }
  }

  // performs get request logic to facilitate the use of all the above logic.
  const loadTweets = function() {
    $.ajax({
      method: "GET",
      url: "/tweets",
      success: (serverData) => {
        console.log(serverData);
        renderTweets(serverData);
      }
    })
  }

  // Starts by generating all new content using the above get request.
  loadTweets();

  // Generates the form access jQuery object
  const $form = $("#tweet-prompt");

  /*
  This is the primary event handler:
    * It Triggers On Tweet Button
    * This handles error and success logic for the Tweet Button
  */
  $form.on("submit", function(event) {
    // Prevents traditional behavior so it can behave as SPA
    event.preventDefault();
    $(".counter").html(`140`);
    // Makes form object more accessible
    const tweetData = $form.serialize();
    // Eases access to heavily utilized field
    $tweetText = $('#tweet-text');
    // Error Handling Logic
    if ($tweetText.val().length < 1) {
      errorMessageG = 'no message exists';
    } else if ($tweetText.val().length > 140) {
      errorMessageG = 'exceeds allowed character count';
    } else if ($tweetText.val().length >= 1 && $tweetText.val().length < 140) {
      errorMessageG = '';
      $('#error-message').slideUp().css('display', 'none');
    }

    // Submit Access Logic
    if ($tweetText.val().length < 1 || $tweetText.val().length > 140) {
      $('#error-message').text(errorMessageG).slideDown().css('display', 'flex');

    } else {
      $('#error-message').slideUp().css('display', 'none');
      $.ajax({
        method: "POST",
        url: "/tweets",
        data: tweetData,
        success: (response) => {
          console.log(response);
          loadTweets();
          $form[0].reset();
          $('#error-message').slideUp().css('display', 'none'); // contingent error logic.
        },
        error: (textStatus, errorThrown) => {
          console.error("Error submitting tweet:", textStatus, errorThrown);
          $('#error-message').text("An error occurred. Please try again later.").slideDown().css('display', 'flex'); // contingent error logic.
        }
      })
    }


  })
});