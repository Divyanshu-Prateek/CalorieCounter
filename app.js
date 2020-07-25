// Storage Controller
const StorageCtrl = (function(){
  // Public Methods
  return {
    storeItems: function(item){
      let items = [];
      // Get Items From Local Storage
      items = StorageCtrl.getItemsFromStorage();
      // Push item to items
      items.push(item);
      // Set items to Local storage
      localStorage.setItem('items',JSON.stringify(items));
    }
    ,getItemsFromStorage: function(){
      let items;
      // Check to see if items present in Local Storage
      if(localStorage.getItem('items')=== null){
        items = [];
      }
      else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }
    ,updateItemStorage : function(updatedItem){
      let items = StorageCtrl.getItemsFromStorage();
      items.forEach(function(item){
        if(item.id===updatedItem.id){
          item.name = updatedItem.name;
          item.calories = updatedItem.calories;
        }
      })
      // Set Local storage to updated list
      localStorage.setItem('items',JSON.stringify(items));
    }
    ,deleteItemStorageByID : function(id){
      let items = StorageCtrl.getItemsFromStorage();
      items.forEach(function(item,index){
        if(item.id===id){
          items.splice(index,1);
        }
      })
      // Set Local storage to updated list
      localStorage.setItem('items',JSON.stringify(items));
    }
    ,clearItemsFromStorage: function(){
      localStorage.removeItem('items').remove();
    }

  }
  
})();


// Item Controller
const ItemCtrl = (function (){
  
  // Item constructor
  const Item = function(id,name,calories){
    this.id =id;
    this.name =name;
    this.calories =calories;
  }
  // Data Structure
  const data ={
    // items: [
    //   // {id:0,name:'Steak Dinner',calories:900},
    //   // {id:1,name:'Cookie',calories:400},
    //   // {id:2,name:'Eggs',calories:300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0 
  }

  // Public functions
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name,calories){
      console.log('Adding to db..')
      let ID ;
      // Create Id
      if(data.items.length>0){
        ID = data.items[data.items.length-1].id +1;
      }
      else{
        ID =0;
      }
      // Convert input Calories string to number
      calories = parseInt(calories);

      // new Item
      const newItem = new Item(ID,name,calories);

      // Push Item to Data structure
      data.items.push(newItem);
      return newItem;
    },
    logData: function(){
      return data;
    },
    getTotalCalories: function(){
      let totalCalories = 0;
      data.items.forEach(function(item){
        totalCalories+= item.calories;
      })
      data.totalCalories = totalCalories;
      return data.totalCalories;
    }
    ,getItemById: function(id){
      let itemFound =null;
      // Loop through items
      data.items.forEach(function(item){
        if(item.id===id){
          itemFound = item;
        }
      })
      return itemFound;
    },
    updateItem: function(name,calories){
      // Calories to Number
      calories = parseInt(calories);
      // find the item in the data.items and Update it
      let foundItem = null;

      data.items.forEach(function(item){
        if(item.id===data.currentItem.id){
          
          item.name = name;
          item.calories = calories;
          foundItem = item;
        }
      })
      return foundItem;
    }
    ,deleteItemByID : function(id){
      const ids = data.items.map(function(item){
        return item.id;
      });
      const index = ids.indexOf(id);

      // remove item from data.items
      data.items.splice(index,1);

    }
    
    ,setCurrentItem: function(item){
      data.currentItem = item;
    }
    ,getCurrentItem: function(){
      return data.currentItem;
    }
    ,clearAllItems : function(item){
      data.items = [];
      data.currentItem = null;
      data.totalCalories = 0;
    }
  }
})();



// UI Controller
const UICtrl = (function (){
  const UISelectors ={
    itemList : '#item-list',
    listItems: '#item-list li',
    addBtn : '.add-btn',
    updateBtn : '.update-btn',
    deleteBtn : '.delete-btn',
    backBtn : '.back-btn',
    clearBtn : '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  }

  // Public functions
  return {
    populateListItems : function(items){
      let html = ''
      items.forEach(function(item){
        html +=`
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong> <em>${item.calories} calories</em>
        <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
      </li>
        `
      })
      // INsert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function(){
      return UISelectors;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },
    addListItem: function(item){
      // Create li item
      const li =document.createElement('li');
      // Add class Name
      li.className = 'collection-item';
      // Add dynamic ID
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = ` <strong>${item.name}</strong> <em>${item.calories} calories</em>
      <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`;
      // Insert Item to UI
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);

    }
    ,updateListItem: function(item){
      // Get List Items from DOM
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Convert Node List to arr
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = 
          `
          <strong>${item.name}</strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
          `;
        }
      })
    }
    ,deleteListItemByID: function(id){
      const itemID = `#item-${id}`
      const listItem = document.querySelector(itemID);
      listItem.remove();

    }
    ,clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value ='';
      document.querySelector(UISelectors.itemCaloriesInput).value ='';

    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value =ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
      
    }
    ,showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState : function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display ='none';
      document.querySelector(UISelectors.deleteBtn).style.display ='none';
      document.querySelector(UISelectors.backBtn).style.display ='none';
      document.querySelector(UISelectors.addBtn).style.display ='inline';

    }
    , showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display ='inline';
      document.querySelector(UISelectors.deleteBtn).style.display ='inline';
      document.querySelector(UISelectors.backBtn).style.display ='inline';
      document.querySelector(UISelectors.addBtn).style.display ='none';
    }
    ,removeAllItems : function(){
      // get all UI elements from the DOM
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Change Node List to an Array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      })
    }

  }
})();

// App Controller
const App = (function (ItemCtrl,StorageCtrl,UICtrl){

  // Load Event Listeners

  const loadEventListeners = function(){
    // Load UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add List Item
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
    
    // Disable submit on Enter
    document.addEventListener('keypress',function(e){
      if(e.keyCode===13 || e.which===13){
        e.preventDefault();
        return false;
      }
    })

    // Edit Item event Listener
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

    // Item Update Submit
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

    // Back Button Event Listener
    document.querySelector(UISelectors.backBtn).addEventListener('click',function(e){
      UICtrl.clearEditState();
      e.preventDefault();
    });

  // Item Delete Event Listener
  document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);  

  // Clear All Event Listener
  document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);

  }

  // Add Item Submit
  const itemAddSubmit = function(e){
    // Get Form Item input from UI
    const input = UICtrl.getItemInput();
    // Check For input name and Calories
    if(input.name!=='' && input.calories!=''){
      // Add Item to input
      const newItem = ItemCtrl.addItem(input.name,input.calories);
      //Add new Item in UI
      UICtrl.addListItem(newItem);
      // Get total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // show total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store Item to Local Storage
      StorageCtrl.storeItems(newItem);

      // Clear Input fields
      UICtrl.clearInput();
    }
    
    e.preventDefault();
  }

  // Add Item Edit Click

  const itemEditClick= function(e){
    // Used Event delegation to target parent Item
    if(e.target.classList.contains('edit-item')){
      console.log('Edit');
      // Get List Item id ex -- item-0,item-1
      const idArr = e.target.parentElement.parentElement.id.split('-');
      const id = parseInt(idArr[1]);

      // Get Item to Update
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set itemToEdit to Current Item
      ItemCtrl.setCurrentItem(itemToEdit);
      //Add Item to form to edit
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  // Add Update Item Submit
  const itemUpdateSubmit = function(e){
    // Get Item From INput
    const input = UICtrl.getItemInput();
    //Update Item in ItemCtrl
    const updatedItem = ItemCtrl.updateItem(input.name,input.calories);
    // Update the UI
    UICtrl.updateListItem(updatedItem);

    // Get total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total Calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // clear Edit State
    UICtrl.clearEditState();

    //Update Local Item Storage
    StorageCtrl.updateItemStorage(updatedItem);

    e.preventDefault();
  }

  // Item Delete Submit
  const itemDeleteSubmit = function(e){
    // Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete currentItem from ItemCtrl
    ItemCtrl.deleteItemByID(currentItem.id);
    // Delete Item from UI 
    UICtrl.deleteListItemByID(currentItem.id);

    // Get total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // clear edit State
    UICtrl.clearEditState();

    // Delete item from Local Storage
    StorageCtrl.deleteItemStorageByID(currentItem.id);

    e.preventDefault();
  }
  // Clear All Items on click
  const clearAllItemsClick = function(e){
    // clear all items from ItemCtrl
    ItemCtrl.clearAllItems();

    // Get total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // show total Calories to UI
    UICtrl.showTotalCalories(totalCalories);
    
    // Remove all items from UICtrl
    UICtrl.removeAllItems();
    
    // Clear All elements from Item Storage
    StorageCtrl.clearItemsFromStorage();

    e.preventDefault();
  }

  // Public functions
  return {
    init : function(){
      // clear edit State
      UICtrl.clearEditState();
      // Get Items from ItemCtrl
      const items = ItemCtrl.getItems();
      // Send Items to UICtrl to populate list
      UICtrl.populateListItems(items);

       // Get total Calories
       const totalCalories = ItemCtrl.getTotalCalories();
       // show total Calories to UI
       UICtrl.showTotalCalories(totalCalories);

      //Load Event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl,StorageCtrl,UICtrl);

// Init App
App.init();