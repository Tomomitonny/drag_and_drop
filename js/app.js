const draggable = document.querySelector('.draggable');
const droppable = document.getElementById('droppable');
const undoStack = []; // Undo用のスタック
const redoStack = []; // Redo用のスタック

// すべてのドラッグ可能な要素を選択
const draggableElements = document.querySelectorAll('.draggable');

// 各要素にドラッグイベントリスナーを追加
draggableElements.forEach(element => {
  element.addEventListener('dragstart', function(event) {
    event.dataTransfer.setData('text/plain', element.textContent);
  });
});

draggable.addEventListener('dragstart', function(event) {
  event.dataTransfer.setData('text/plain', draggable.textContent);
});

droppable.addEventListener('dragover', function(event) {
  event.preventDefault();
});

droppable.addEventListener('drop', function(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  
  const newElement = document.createElement('div');
  newElement.className = 'moving-element';
  newElement.textContent = data;
  newElement.style.position = 'absolute';
  newElement.style.width = 'auto'; 
  newElement.style.height = 'auto'; 
  newElement.style.left = (event.clientX - droppable.getBoundingClientRect().left - 8 ) + 'px';
  newElement.style.top = (event.clientY - droppable.getBoundingClientRect().top + 13 ) + 'px';
  droppable.appendChild(newElement);

  // Undoスタックに追加
  undoStack.push({ action: 'add', element: newElement });

  // Redoスタックをクリア
  redoStack.length = 0;


  newElement.setAttribute('draggable', true);
  newElement.addEventListener('dragstart', function(event) {
    event.dataTransfer.setData('text/plain', newElement.textContent);
    draggedElement = newElement; 
    originalPosition = { left: newElement.style.left, top: newElement.style.top }; // 元の位置を記録する
  });
});

// ドラッグされた要素がドロップエリア外にドロップされた場合、その要素を元の位置に戻す
document.addEventListener('dragend', function(event) {
  if (draggedElement !== null) {
    const rect = droppable.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    う
        
    // ドロップエリア外にドロップされた場合
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      // 要素を元の位置に戻す
      draggedElement.style.left = originalPosition.left;
      draggedElement.style.top = originalPosition.top;
    }
    draggedElement = null;
    originalPosition = null;
  }
});

droppable.addEventListener('dblclick', function(event) {
  const target = event.target;
  if (target && target.tagName === 'DIV' && target !== droppable) {
    // Undoスタックに追加
    undoStack.push({ action: 'remove', element: target });

    // Redoスタックをクリア
    redoStack.length = 0;

    target.remove();
  }

  
});

const deleteButton = document.getElementById('deleteButton');

deleteButton.addEventListener('click', function() {
  const elementsToRemove = droppable.querySelectorAll('div');
  elementsToRemove.forEach(element => {
    element.remove();
  });
});


const undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', function() {
  if (undoStack.length > 0) {
    const operation = undoStack.pop();
    if (operation.action === 'add') {
      operation.element.remove();
    } else if (operation.action === 'remove') {
      droppable.appendChild(operation.element);
    }
    // Redoスタックに追加
    redoStack.push(operation);
  }
});

const redoButton = document.getElementById('redoButton');
redoButton.addEventListener('click', function() {
  if (redoStack.length > 0) {
    const operation = redoStack.pop();
    if (operation.action === 'add') {
      droppable.appendChild(operation.element);
    } else if (operation.action === 'remove') {
      operation.element.remove();
    }
    // Undoスタックに追加
    undoStack.push(operation);
  }
});

