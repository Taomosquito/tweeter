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
    <img src="${randomObject.user.avatars}" alt="${randomObject.user.name}'s avatar" />  
    <p>${randomObject.user.name}</p>
    </div>
      <p class="greyOut">${randomObject.user.handle}</p>
    </header>
    <section>
    ${randomObject.content.text}
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

    return $tweet;
  }

  const renderTweets = function(randomObjectArr) {
    console.log("Random Object Array: ", randomObjectArr);
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

  const $form = $("#tweet-prompt");

  $form.on("submit", function(event) {
    event.preventDefault();
    const tweetData = $form.serialize();
    $.ajax({
      method: "POST",
      url: "/tweets",
      data: tweetData,
      success: (response) => {
        console.log(response);
        loadTweets(response);
      }
    })
  })
})
