/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  const $tweetsContainer = $('#tweets-container');

  const createTweetElement = function(randomObject) {
    const formattedTime = timeago.format(randomObject.created_at);
    let $tweet = $(`
    <article class="tweet">
    <header>
    <div class="tweet-topLeft">
    <img src="${randomObject.user.avatars}" alt="">  
    <p>class="user-name"</p>
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
      return alert('no message exists');
    }
    if ($tweetText.val().length > 140) {
      return alert('exceeds allowed character count');
    }

    $.ajax({
      method: "POST",
      url: "/tweets",
      data: tweetData,
      success: (response) => {
        loadTweets();
      }
    })
  })
})
