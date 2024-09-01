document.addEventListener("DOMContentLoaded", function () {
  const startScrollBtn = document.getElementById('startScroll');
  const stopScrollBtn = document.getElementById('stopScroll');
  const textToSpeechBtn = document.getElementById('textToSpeech');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settings');
  const applySettingsBtn = document.getElementById('applySettings');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const setDefaultBtn = document.getElementById('setDefault');
  const fontSizeInput = document.getElementById('fontSize');
  const fontFamilySelect = document.getElementById('fontFamily');
  const textColorInput = document.getElementById('textColor');
  const searchInput = document.getElementById('searchInput');
  const contentContainer = document.getElementById('content-container');
  const floatingBtnContainer = document.getElementById('floatingBtnContainer');

  let autoScrollInterval;

  // Auto Scroll functionality
  startScrollBtn.addEventListener('click', () => {
      autoScrollInterval = setInterval(() => {
          window.scrollBy(0, 1);
      }, 100);
  });

  stopScrollBtn.addEventListener('click', () => {
      clearInterval(autoScrollInterval);
  });

    // Text to Speech functionality
textToSpeechBtn.addEventListener('click', () => {
const synth = window.speechSynthesis;
const content = getContent();
console.log('Content:', content); // Log the content
const utterance = new SpeechSynthesisUtterance(content);
synth.speak(utterance);
});


  // Settings Modal
  settingsBtn.addEventListener('click', () => {
      settingsModal.style.display = settingsModal.style.display === 'none' ? 'block' : 'none';
  });

  // Apply Settings
  applySettingsBtn.addEventListener('click', () => {
      applySettings();
      settingsModal.style.display = 'none';
  });

  // Save Settings (for demonstration, not saving to local storage in this example)
  saveSettingsBtn.addEventListener('click', () => {
      applySettings();
  });

  // Set Default Settings
  setDefaultBtn.addEventListener('click', () => {
      fontSizeInput.value = 16;
      fontFamilySelect.value = 'Arial, sans-serif';
      textColorInput.value = '#000000';
      applySettings();
  });

  // Apply settings function
  function applySettings() {
      const contentText = getContent();
      contentText.style.fontSize = `${fontSizeInput.value}px`;
      contentText.style.fontFamily = fontFamilySelect.value;
      contentText.style.color = textColorInput.value;
      // Apply more settings here if needed
  }

  // Search functionality
  searchInput.addEventListener('keyup', async (event) => {
      const query = event.target.value;
      if (query.length > 0) {
          const searchResults = await searchWikipedia(query);
          displaySearchResults(searchResults);
      } else {
          // Clear content if search query is empty
          contentContainer.innerHTML = '';
      }
  });

  // Function to search Wikipedia
  async function searchWikipedia(query) {
      try {
          const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${query}&origin=*`);
          const data = await response.json();
          return data.query.search;
      } catch (error) {
          console.error('Error fetching search results:', error);
          return [];
      }
  }

 // Text to Speech functionality
textToSpeechBtn.addEventListener('click', () => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(getContent().innerText);
  synth.speak(utterance);
});

// Function to display search results
function displaySearchResults(results) {
  contentContainer.innerHTML = '';
  results.forEach((result) => {
      const article = document.createElement('article');
      article.innerHTML = `
          <h1>${result.title}</h1>
          <p>${result.snippet}</p>
      `;
      article.addEventListener('click', () => {
          displaySelectedResult(result);
      });
      article.classList.add('searchResult'); // Add class for styling
      contentContainer.appendChild(article);
  });
}

// Function to display selected search result
async function displaySelectedResult(result) {
  try {
      const fullContent = await fetchFullContent(result.pageid);
      const imageURL = await getImageURL(result.title);
      const selectedArticle = document.createElement('article');
      selectedArticle.innerHTML = `
          <h1>${result.title}</h1>
          <img src="${imageURL}" alt="${result.title}" style="width: 500px; height: auto;">
          <p>${fullContent}</p>
      `;
      contentContainer.innerHTML = '';
      contentContainer.appendChild(selectedArticle);
      floatingBtnContainer.style.display = 'block'; // Show floating button container
  } catch (error) {
      console.error('Error displaying selected result:', error);
      // Handle error
  }
}


// Function to fetch full content of the selected page
async function fetchFullContent(pageID) {
  try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${pageID}&origin=*`);
      const data = await response.json();
      const pages = data.query.pages;
      const page = pages[pageID];
      return page.extract || 'No content available'; // Return page content or a message if no content is available
  } catch (error) {
      console.error('Error fetching full content:', error);
      throw error;
  }
}

  // Function to get image URL from Wikipedia
  async function getImageURL(title) {
      try {
          const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=500&titles=${title}&origin=*`);          const data = await response.json();
          const pages = data.query.pages;
          const pageID = Object.keys(pages)[0];
          return pages[pageID].thumbnail ? pages[pageID].thumbnail.source : 'https://via.placeholder.com/150'; // Placeholder image if no image found
      } catch (error) {
          console.error('Error fetching image URL:', error);
          return 'https://via.placeholder.com/150'; // Placeholder image if error occurs
      }
  }

  // Function to get the current content section
  function getContent() {
      return contentContainer;
  }
});