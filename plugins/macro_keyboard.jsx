#include "../cc/main.jsx"
init((new File($.fileName)).parent + '/../');

WORKAREA = '/Users/damu/Pictures/Work Area/'

press_keys = function(keys)
{
  if (conn.open("127.0.0.1:7564")) {
    conn.write('PUT ' + keys + '\n');
    conn.close();
  }
}

customSave = function()
{
  try {
    // This causes exception if not saved before
    var path = activeDocument.path;
    // This blocks, send cmd+s instead
    /*
    var desc = new ActionDescriptor();
    desc.putPath(sTID('in'), new File(path));
    executeAction(sTID("save"), desc, DialogModes.NO);
    */
    press_keys('cmd+s');
  } catch (e) {
    n = Path.uniqueFilename(WORKAREA, Path.simplename(app.activeDocument.name.replace(/-1$/, '').replace(/-Edit$/, '')), '.psb');
    app.activeDocument.saveAsPSB(n);
  }
}

var key = NaN;
var conn = new Socket;

if (conn.open("127.0.0.1:7564")) {
  conn.write("GET\n");
  key = parseInt(conn.read(999999));
  conn.close();
}

switch(key) {
  // Save row
  case 1: app.activeDocument.activeLayer.toggleMaskEnabled(); break;
  case 2: app.activeDocument.activeLayer.showMask(true); break;
  case 3: app.activeDocument.activeLayer.showMaskOverlay(true); break;
  case 5: onSaveLayersClick(); break;
  case 6: onExport4Click(); break;
  case 7: onExport2Click(); break;
  case 8: onExport3Click(); break;
  case 9: onSaveFbClick(); break;
  case 10: onSave4KClick(); break;
  case 11: customSave(); break;
  // Helpers
  case 14: onMakeMemoClick(); break;
  case 15: onMakePerspectiveLinesClick(); break;
  case 16: onMakeSolarisationClick(); break;
  case 17: onMakeSkinCheckerClick(); break;
  case 18: onBlendIfClick(); break;
  case 19: onMakeSaturationMapClick(); break;
  case 20: onMatchTonesClick(); break;
  case 21: onMakeLightnessClick(); break;
  case 23: Photoshop.zoom(20); break;
  case 47: Photoshop.zoom(200); break;
  // Selection
  case 31: Photoshop.selectTool('cropTool'); break;
  case 32: app.activeDocument.inverseSelection(); break;
  case 34: Photoshop.selectTool('marqueeRectTool'); break;
  case 43: app.activeDocument.clearSelection(); break;
  case 44: Photoshop.selectTool('polySelTool'); break;
  case 45: Photoshop.selectTool('lassoTool'); break;
  case 46: Photoshop.selectTool('magicLassoTool'); break;
  // Undo & Redo
  case 57: Photoshop.undo(); break;
  case 59: Photoshop.redo(); break;
  // Arrow Group
  case 80: Photoshop.selectTool('moveTool'); break;
  // Basic Tools
  case 29: Photoshop.selectTool('curvaturePenTool'); break;
  case 41: Photoshop.selectTool('magicStampTool'); break;
  case 53: Photoshop.selectTool('cloneStampTool'); break;
  case 65: Photoshop.selectTool('spotHealingBrushTool'); break;
  case 77: Photoshop.selectTool('gradientTool'); break;
  case 30: Photoshop.selectTool('typeCreateOrEditTool'); break;
  case 48: Photoshop.selectToolPreset('paintbrushTool', 'Hardness 95%'); break;
  case 36: Photoshop.selectToolPreset('paintbrushTool', 'Flow 100%'); break;
  case 24: Photoshop.selectToolPreset('paintbrushTool', 'Flow 10%'); break;
  case 12: Photoshop.selectToolPreset('paintbrushTool', 'Flow 3%'); break;
  case 54: onMakeCleaningClick(); break;
  case 55: app.activeDocument.activeLayer.fill('foregroundColor'); break;
  case 60: Photoshop.swapColors(); break;
  case 78: Photoshop.invert(); break;
  case 79: Photoshop.setDefaultColors(); break;
  // Advanced Tools
  case 26: onMakeFSClick(); break;
  case 38: onCombineDocumentsClick(); break;
  case 50: onUpdateFromUnderClick(); break;
  case 62: onStampUnderClick(); break;
  case 27: onMakeMatchClick(); break;
  case 39: onFillEmptyClick(); break;
  case 51: onSmartKeepingMaskClick(); break;
  case 63: onSmartFromUnderClick(); break;
  case 28: app.activeDocument.activeLayer.expandMask(); break;
  case 40: app.activeDocument.activeLayer.contractMask(); break;
  // Finishing
  case 56: onHighPassSharpeningClick(); break;
  case 13: onMakeWashOutClick(); break;
  case 25: onMakeVignetteClick(); break;
  case 68: onAddNoiseClick(); break;
  case 37: onMakeDBClick(); break;
  case 49: onMakeCookieClick(); break;

  case isNaN(key):
    alert('Invalid key from the macro keyboard.');
    break;
  default:
    alert('No handler for this key: ' + key);
}