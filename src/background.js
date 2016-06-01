function setBackground (url) {
  return; // FIXME
  ii.src = url;
}

jQuery("#custombg").click(function() {
  if (jQuery(this).attr('class') == 'on') {
    options.custombg = false;
    url = prompt('Enter new URL (image):', '');
    if (url && url.length > 10) {
      options.custombg = true;
      options.background = url;
      setBackground(url);
    } else {
      options.background = '';
      setBackground();
      jQuery("#custombg").attr('class', 'off');
      jQuery("#custombg").html('OFF');
    }
  } else {
    options.background = '';
    setBackground();
  }
});

// reference black background?
// setBackground('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AQYBigs0bXWaQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAADUlEQVQI12P4//8/AwAI/AL+XJ/P2gAAAABJRU5ErkJggg==');
