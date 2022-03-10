window.GWAdvCondLogic = function (args) {
  try {
    gform;
  } catch (e) {
    console.error(
      "GWAdvCondLogic was inititated before gform object was loaded."
    );
    return;
  }
  var self = this;

  // copy all args to current object: (list expected props)
  for (prop in args) {
    if (args.hasOwnProperty(prop)) {
      self[prop] = args[prop];
    }
  }

  self.init = function () {
    self.doingLogic = false;
    // do the magic
    gform.addFilter("gform_is_value_match", function (isMatch, formId, rule) {
      if (formId != self.formId) {
        return isMatch;
      }
      if (rule.value == "__return_true") {
        return true;
      } else if (rule.value == "__return_false") {
        return false;
      } else if (
        rule.fieldId != "__adv_cond_logic" ||
        self.doingLogic ||
        !self.logic[rule.value]
      ) {
        //quit now if not adv_logic rule, or already doing logic
        return isMatch;
      }

      self.doingLogic = true;
      var logic = self.logic[rule.value];
      isMatch = self.isAdvancedConditionalLogicMatch(formId, logic);

      self.doingLogic = false;

      // return logic.actionType == 'hide' ? !isMatch : isMatch;
      return isMatch;
    });

    var fieldIds = self.getFieldIds();
    console.debug("applying gfrules to ", fieldIds);
    gf_apply_rules(self.formId, fieldIds, true);
  };

  self.getFieldIds = function () {
    var fieldIds = [];
    if (!self.logic) {
      return fieldIds;
    }

    Object.keys(self.logic).forEach(function (logickey) {
      if (!logickey.startsWith("field")) {
        return;
      } else {
        var fieldId = logickey.split("/")[1];
        fieldIds.push(fieldId);
      }
    });
    return fieldIds;
  };

  self.isAdvancedConditionalLogicMatch = function (formId, logic) {
    for (var i in logic.groups) {
      if (logic.groups.hasOwnProperty(i)) {
        var action = gf_get_field_action(formId, logic.groups[i]);
        if (action == "show" || action == "send") {
          return true;
        }
      }
    }
    return false;
  };
  self.init();
};
