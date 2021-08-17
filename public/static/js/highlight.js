var data = [];
var dataNote = [];
var saveID = null;

function addToOldArray(id, range, note) {
	data.push({
		id: id,
		range: range,
		note: note,
	});
}

function addToArray(id, range, note, position) {
	dataNote.push({
		id: id,
		range: range,
		note: note,
		position: position,
	});
}

function removeInArray(id) {
	dataNote.forEach((item, index, arr) => {
		if (item.id === id) {
			arr.splice(index, 1);
		}
	});
}

function checkArray(id) {
	var check = false;
	dataNote.forEach((obj) => {
		if (obj.id === id) {
			check = true;
		}
	});
	return check;
}

function getRangeInArray(id) {
	let range = null;
	data.forEach((obj) => {
		if (obj.id === id) {
			range = obj.range;
		}
	});
	return range;
}

function getSelection() {
	let sel = window.getSelection();
	return sel;
}

function arrayPosition(p) {
	let position = [];
	position.push({
		top: p.top,
		bottom: p.bottom,
		left: p.left,
		right: p.right,
		width: p.width,
	});
	return position;
}

// CLICK OUTSIDE TO HIDE POPOVER
// $(document).click(function (e) {
// 	if (
// 		!(
// 			e.target.className === 'highlight' ||
// 			e.target.className === 'highlight-content'
// 		)
// 	) {
// 		$('.popover-an').hide();
// 	}
// });

// ----------- MOUSEUP ----------- //
$('.content-body')
	.find('.highlight')
	.on('mouseup', function () {
		console.log('RUNNNNNNNNNNNN');
		// CREATE ID
		let number = Math.floor(Math.random() * 1000 + 1);
		let id = 'id-' + number;

		// GET RANGE
		let sel = getSelection();
		let range = sel.getRangeAt(0);

		if (range.toString().length > 0) {
			console.log('RANGE: ', range);
			console.log('test: ', range.getBoundingClientRect());

			// GET POSITION
			let p = range.getBoundingClientRect();
			let position = arrayPosition(p);

			// PUSH TO DATA
			data.push({
				id: id,
				range: range,
				note: '',
				position: position,
			});

			// SHOW POPOVER

			let specialTop = p.top - 40;
			let specialLeft = p.left + p.width - 40;
			specialTop = specialTop.toString() + 'px';
			specialLeft = specialLeft.toString() + 'px';

			$('.popover-an')
				.css({
					top: specialTop,
					// right: position[0].right,
					left: position[0].left,
					// bottom: position[0].bottom,
					display: 'block',
				})
				.attr('data-id', id);

			$('.wrap-popup-note').attr('data-id', id);
		} else {
			$('.popover-an').hide();
		}

		console.log('DATA: ', data);
	});

// ------------ CLICK HIGHLIGHT -------------
$('.popover-an .btn-highlight').on('click', function () {
	let dataId = $(this).parent().parent().attr('data-id');
	let range = null;
	data.forEach((obj) => {
		if (obj.id === dataId) {
			range = obj.range;
		}
	});

	//Get id and element
	let beforeElementId = range.startContainer.parentElement.id;
	let beforeElement = range.startContainer.parentNode;

	let afterElementId = range.endContainer.parentElement.id;
	let afterElement = range.endContainer.parentNode;

	let getRangeFromParent = null;

	let nodeNameStart = range.startContainer.parentNode.nodeName;
	let nodeNameEnd = range.endContainer.parentNode.nodeName;

	// Check the element is overlay or not? (Check coi có đang bị chồng hay không?)

	if (nodeNameStart === 'P' && nodeNameEnd === 'P') {
		let span = document.createElement('span');
		span.setAttribute('id', dataId);
		span.classList.add('highlight-text');
		range.surroundContents(span);
		let p = range.getBoundingClientRect();
		let position = arrayPosition(p);

		$(this).parent().parent().hide();

		addToArray(dataId, range, '', position);
	} else {
		// Create, id, span tag
		let number = Math.floor(Math.random() * 1000 + 1);
		let id = 'id-' + number;
		let span = document.createElement('span');

		//  ===> add id & class for span
		span.setAttribute('id', id);
		span.classList.add('highlight-text');

		if (nodeNameStart === 'SPAN' && nodeNameEnd === 'SPAN') {
			console.log('TH 1');
			// Set positon for new range
			let newRange = document.createRange();
			newRange.setStartBefore(beforeElement);

			newRange.setEndAfter(afterElement);
			newRange.surroundContents(span);
			let p = newRange.getBoundingClientRect();
			let position = arrayPosition(p);

			// Add to new array and old array  //
			addToArray(id, newRange, '', position);
			addToOldArray(id, newRange, '', position);

			beforeElement.outerHTML = beforeElement.innerHTML;
			afterElement.outerHTML = afterElement.innerHTML;
			removeInArray(beforeElementId);
			removeInArray(afterElementId);
		}
		if (nodeNameStart === 'SPAN' && nodeNameEnd === 'P') {
			console.log('TH 2');
			// Set positon for new range
			let newRange = document.createRange();
			newRange.setStartBefore(beforeElement);

			newRange.setEnd(range.endContainer, range.endOffset);
			newRange.surroundContents(span);
			let p = newRange.getBoundingClientRect();
			let position = arrayPosition(p);

			// Add to new array and old array  //
			addToArray(id, newRange, '', position);
			addToOldArray(id, newRange, '', position);

			beforeElement.outerHTML = beforeElement.innerHTML;
			removeInArray(beforeElementId);
		}
		if (nodeNameEnd === 'SPAN' && nodeNameStart === 'P') {
			// Set positon for new range
			let newRange = document.createRange();
			newRange.setStart(range.startContainer, range.startOffset);

			newRange.setEndAfter(afterElement);
			newRange.surroundContents(span);
			let p = newRange.getBoundingClientRect();
			let position = arrayPosition(p);

			// Add to new array and old array  //
			addToArray(id, newRange, '', position);
			addToOldArray(id, newRange, '', position);

			afterElement.outerHTML = afterElement.innerHTML;
			removeInArray(afterElementId);
			console.log('TH 3');
		}
	}

	$('.popover-an').hide();
	console.log('DATA NOTE: ', dataNote);
});

// --------------- CLICK to OPEN and CLOSE TO SAVE NOTE -----------------
$('.btn-note').on('click', function () {
	console.log('click');
	let id = $('.wrap-popup-note').attr('data-id');
	saveID = id;
	let range = getRangeInArray(id);
	let note = '';

	// ----- //
	if (!checkArray(id)) {
		let span = document.createElement('span');
		span.setAttribute('id', id);
		span.classList.add('highlight-text');
		range.surroundContents(span);

		let p = range.getBoundingClientRect();
		let position = arrayPosition(p);
		addToArray(id, range, note, position);

		$('#getNote').val('');
	} else {
		dataNote.forEach((obj) => {
			if (obj.id === id) {
				note = obj.note;
			}
		});
		$('#getNote').val(note);
	}
	// ----- //
	$('.wrap-popup-note').show();
	$('.popover-an').hide();
});

//  --- Close ---
$('.wrap-popup-note .close-popup').on('click', function () {
	let note = $('#getNote').val();
	// let id = $('.wrap-popup-note').attr('data-id');
	let id = saveID;

	let range = getRangeInArray(id);

	// Check id exit in array before or not ?
	if (checkArray(id)) {
		dataNote.forEach((obj) => {
			if (obj.id === id) {
				obj.note = note;
			}
		});
	}

	console.log('LAST DATA: ', dataNote);
	$('.wrap-popup-note').hide();
});

// Typing and save
$('#getNote').on('change paste keyup', function () {
	let getId = saveID;
	console.log('get id: ', getId);

	let text = $(this).val();
	if (getId) {
		dataNote.forEach((obj) => {
			if (obj.id === getId) {
				obj.note = text;
			}
		});
	} else {
		let id = $('.wrap-popup-note').attr('data-id');
		dataNote.forEach((obj) => {
			if (obj.id === id) {
				obj.note = text;
			}
		});
	}

	console.log('TEXT: ', text);
});

// CLICK TO WATCH NOTE
// $('.highlight').on('click', function (e) {
// 	let id = e.target.id;
// 	let note = null;

// 	if (checkArray(id)) {
// 		$('.wrap-popup-note').show();
// 		$('.wrap-popup-note').attr('data-id', id);
// 		$('#getNote').html(note);
// 		dataNote.forEach((obj) => {
// 			if (obj.id === id) {
// 				note = obj.note;
// 			}
// 		});
// 		$('#getNote').val(note);
// 	}
// });

//  --------- ACTION HOVER POPOVER ------------ //
$('.highlight').on('mouseover', function (e) {
	let id = e.target.id;
	let position = [];
	let note = null;

	if (checkArray(id)) {
		$('.wrap-popup-note').attr('data-id', id);
		// get position to show popover
		dataNote.forEach((obj) => {
			if (obj.id === id) {
				position = position.concat(obj.position);
				note = obj.note;
			}
		});
		let specialTop = position[0].top - 35;
		specialTop = specialTop.toString() + 'px';

		$('.popover-hover')
			.css({
				top: specialTop,
				// right: position[0].right,
				left: position[0].left,
				// bottom: position[0].bottom,
				display: 'block',
			})
			.attr('data-id', id);
	} else {
		$('.popover-hover').css('display', 'none');
	}
});

// --------- CLICK TO *REMOVE* NOTE AND HIGHLIGHT ---------- //
$('.btn-remove').on('click', function () {
	let id = $('.popover-hover').attr('data-id');

	dataNote.forEach((obj, index, arr) => {
		if (obj.id === id) {
			arr.splice(index, 1);
		}
	});

	document.getElementById(id).outerHTML = document.getElementById(id).innerHTML;
});

// --------- CLICK TO *REMOVE ALL* -------------//
$('.btn-remove-all').on('click', function () {
	dataNote = [];
	console.log('data after remove: ', dataNote);
	let allSpan = document.querySelectorAll('.highlight-text');
	allSpan.forEach((item) => {
		item.outerHTML = item.innerHTML;
	});
});
