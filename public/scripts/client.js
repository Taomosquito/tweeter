/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {
  const $tweetsContainer = $('#tweets-container');

  let errorMessageG = '';
  $('#error-message').slideUp().css('display', 'none');

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

    $tweet.find(".user-name").text(randomObject.user.name);
    $tweet.find(".greyOut.user-handle").text(randomObject.user.handle);
    $tweet.find(".tweet-content").text(randomObject.content.text);

    return $tweet;
  }

  const renderTweets = function(randomObjectArr) {
    $tweetsContainer.empty();
    for (singleObject of randomObjectArr) {
      let $renderedTweet = createTweetElement(singleObject);
      $tweetsContainer.prepend($renderedTweet);
    }
  }

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

  loadTweets();

  const $form = $("#tweet-prompt");

  $form.on("submit", function(event) {
    event.preventDefault();

    const tweetData = $form.serialize();

    $tweetText = $('#tweet-text');

    if ($tweetText.val().length < 1) {
      errorMessageG = 'no message exists';
    } else if ($tweetText.val().length > 140) {
      errorMessageG = 'exceeds allowed character count';
    } else if ($tweetText.val().length >= 1 && $tweetText.val().length < 140) {
      errorMessageG = '';
      $('#error-message').slideUp().css('display', 'none');
    }


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
          $('#error-message').slideUp().css('display', 'none'); // Ensure error message is hidden after successful submission
        },
        error: (textStatus, errorThrown) => {
          console.error("Error submitting tweet:", textStatus, errorThrown);
          $('#error-message').text("An error occurred. Please try again later.").slideDown().css('display', 'flex');
        }
      })
    }


  })
});