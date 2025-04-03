document.addEventListener('DOMContentLoaded', function() {
  // 1. SERVINGS ADJUSTER TOOL
  const createServingsTool = () => {
      const tool = document.createElement('div');
      tool.className = 'servings-tool';
      tool.innerHTML = `
          <h3>👨‍👩‍👧‍👦 Adjust for your group size</h3>
          <div class="servings-controls">
              <button class="servings-decrease" aria-label="Fewer servings">−</button>
              <span class="servings-count">4</span>
              <button class="servings-increase" aria-label="More servings">+</button>
          </div>
          <p class="servings-message">
              <span class="servings-emoji">👨‍👩‍👧‍👦</span>
              <span class="servings-text">Family dinner time! (4 servings)</span>
          </p>
          <p class="servings-tip">Perfect for gathering around the table</p>
      `;
      
      const ingredientsSection = document.querySelector('.ingredients');
      if (ingredientsSection) {
          ingredientsSection.prepend(tool);
      } else {
          document.querySelector('.recipe__content').prepend(tool);
      }
      
      const messages = [
          { min: 1, max: 1, text: "Perfect solo feast!", emoji: "🍽️", tip: "Enjoy your me-time with this delicious meal!" },
          { min: 2, max: 2, text: "Romantic dinner for two", emoji: "💑", tip: "Light some candles and enjoy together!" },
          { min: 3, max: 4, text: "Family dinner time!", emoji: "👨‍👩‍👧‍👦", tip: "Perfect for gathering around the table" },
          { min: 5, max: 8, text: "Small party portions", emoji: "🎉", tip: "Great for game night or casual gatherings" },
          { min: 9, max: 12, text: "Big crowd coming!", emoji: "🧑‍🤝‍🧑", tip: "Consider making two batches for easier serving" },
          { min: 13, max: Infinity, text: "Catering-sized batch!", emoji: "🏗️", tip: "You might need an extra oven for this one!" }
      ];
      
      let servings = 4;
      const countElement = tool.querySelector('.servings-count');
      const messageElement = tool.querySelector('.servings-message');
      const emojiElement = tool.querySelector('.servings-emoji');
      const textElement = tool.querySelector('.servings-text');
      const tipElement = tool.querySelector('.servings-tip');
      
      const updateMessage = () => {
          const matchedMessage = messages.find(msg => servings >= msg.min && servings <= msg.max);
          emojiElement.textContent = matchedMessage.emoji;
          textElement.textContent = `${matchedMessage.text} (${servings} ${servings === 1 ? 'serving' : 'servings'})`;
          tipElement.textContent = matchedMessage.tip;
          
          if (servings > 12) {
              messageElement.classList.add('large-party');
          } else {
              messageElement.classList.remove('large-party');
          }
      };
      
      const adjustIngredients = () => {
          const ingredients = document.querySelectorAll('.ingredients li');
          ingredients.forEach(ingredient => {
              const text = ingredient.textContent.trim();
              const match = text.match(/^([\d½¼¾⅓⅔]+)\s+(.*)/);
              
              if (match) {
                  const originalAmount = match[1];
                  const restOfText = match[2];
                  const adjustedAmount = calculateAdjustedQuantity(originalAmount, servings/4);
                  ingredient.textContent = `${adjustedAmount} ${restOfText}`;
              }
          });
      };
      
      const calculateAdjustedQuantity = (amount, multiplier) => {
          const fractionMap = {
              '½': 0.5, '¼': 0.25, '¾': 0.75, 
              '⅓': 0.333, '⅔': 0.666
          };
          
          let value = fractionMap[amount] || parseFloat(amount);
          value *= multiplier;
          
          // Convert back to fractions for display
          if (value === 0.5) return '½';
          if (value === 0.25) return '¼';
          if (value === 0.75) return '¾';
          if (value > 0.33 && value < 0.34) return '⅓';
          if (value > 0.66 && value < 0.67) return '⅔';
          
          // For whole numbers
          if (Number.isInteger(value)) return value.toString();
          
          // For decimal values
          return value.toFixed(2).replace(/\.?0+$/, '');
      };
      
      tool.querySelector('.servings-decrease').addEventListener('click', () => {
          if (servings > 1) {
              servings--;
              countElement.textContent = servings;
              updateMessage();
              adjustIngredients();
          }
      });
      
      tool.querySelector('.servings-increase').addEventListener('click', () => {
          if (servings < 20) {
              servings++;
              countElement.textContent = servings;
              updateMessage();
              adjustIngredients();
          }
      });
  };

  // 2. PRINT BUTTON FUNCTIONALITY
  const addPrintButton = () => {
      const printBtn = document.createElement('button');
      printBtn.className = 'print-btn';
      printBtn.innerHTML = '📄 Print This Recipe';
      printBtn.addEventListener('click', () => {
          setTimeout(window.print, 300);
      });
      const content = document.querySelector('.recipe__content');
      content.appendChild(printBtn);
    }

  // 3. NUTRITION SECTION CELEBRATION
  const setupNutritionCelebration = () => {
      const nutritionSection = document.querySelector('.nutrition');
      if (nutritionSection) {
          const observer = new IntersectionObserver((entries) => {
              if (entries[0].isIntersecting) {
                  nutritionSection.style.animation = 'celebrate 2s';
                  setTimeout(() => {
                      nutritionSection.style.animation = '';
                  }, 2000);
                  observer.unobserve(nutritionSection);
              }
          }, { threshold: 0.5 });
          
          observer.observe(nutritionSection);
      }
  };

  // 4. INITIALIZE ALL FEATURES
  createServingsTool();
  addPrintButton();
  setupNutritionCelebration();

  // 5. LOADING ANIMATION (if loading from db.json)
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
      setTimeout(() => {
          loadingElement.style.display = 'none';
          document.getElementById('recipe-container').style.display = 'block';
      }, 1000);
  }
});