/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const tweetDataObjects = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1720371217904
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1720487527136
  }
];


$(document).ready(function() {

  const $tweetsContainer = $('#tweets-container');

  const createTweetElement = function(randomObject) {
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
      <p>created: ${randomObject.created_at}</p>
      <footer class="icons">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </footer>
    `);

    return $tweet;
  };

  const renderTweets = function(randomObjectArr) {
    console.log("Random Object Array: ", randomObjectArr);
    for (singleObject of randomObjectArr) {
      let $renderedTweet = createTweetElement(singleObject);
      $tweetsContainer.append($renderedTweet);
    }
  }


  const $form = $("#tweet-prompt");

  $form.on("submit", function(event) {
    event.preventDefault();
    const tweetData = $form.serialize();;
    $.ajax({
      method: "POST",
      url: "/tweets",
      data: tweetData,
      success: (response) => {
        console.log(response)
        renderTweets(response)
      }
    })

  })

  // renderTweets(tweetDataObjects);
})