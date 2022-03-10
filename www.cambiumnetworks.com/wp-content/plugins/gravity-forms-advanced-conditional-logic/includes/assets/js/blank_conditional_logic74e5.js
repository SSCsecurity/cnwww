gform.addFilter("gform_is_value_match", function(isMatch, formId, rule) {
  if (rule.value !== "") {
    return isMatch;
  }
  // console.debug("matching ((blank)) fields: ", rule);

  var get_value = function(formId, fieldId) {
    var checkboxes = jQuery(
      'input[id^="choice_{0}_{1}_"]'.format(formId, fieldId)
    );
    if (!checkboxes.length) {
      return false;
    } else {
      var numSelections = 0;
      checkboxes.each(function() {
        if (this.checked) {
          numSelections++;
        }
      });
      // console.debug("debug: ", numSelections);
    }
    return numSelections ? numSelections : null;
  };
  var inputValues = get_value(formId, rule.fieldId);
  if (inputValues === false) {
    return isMatch;
  }
  if (inputValues === null) {
    // console.debug("nothing selected: ", inputValues);
    isMatch = rule.operator == "is" ? true : false;
  } else {
    // console.debug("something selected: ", inputValues);
    isMatch = rule.operator == "is" ? false : true;
  }
  // console.debug("match result: ", isMatch);
  return isMatch;
});
