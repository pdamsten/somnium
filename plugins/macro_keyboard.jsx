#include "../cc/main.jsx"
init((new File($.fileName)).parent + '/../');

var key = NaN;
var conn = new Socket;

if (conn.open("127.0.0.1:7564")) {
  conn.write("GET\n");
  key = parseInt(conn.read(999999));
  conn.close();
}

switch(key) {
  // Save row
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
  // Selection
  case 32: Photoshop.selectTool('cropTool'); break;
  case 33: app.activeDocument.inverseSelection(); break;
  case 35: Photoshop.selectTool('marqueeRectTool'); break;
  case 45: Photoshop.selectTool('polySelTool'); break;
  case 46: Photoshop.selectTool('lassoTool'); break;
  case 47: Photoshop.selectTool('magicLassoTool'); break;
  // Undo & Redo
  case 57: Photoshop.undo(); break;
  case 59: Photoshop.redo(); break;
  // Arrow Group
  case 58: Photoshop.selectTool('moveTool'); break;
  case 71: Photoshop.zoom(200); break;
  // Basic Tools
  case 30: Photoshop.selectTool('curvaturePenTool'); break;
  case 42: Photoshop.selectTool('magicStampTool'); break;
  case 54: Photoshop.selectTool('cloneStampTool'); break;
  case 66: Photoshop.selectTool('spotHealingBrushTool'); break;
  case 78: Photoshop.selectTool('gradientTool'); break;
  case 31: Photoshop.selectTool('typeCreateOrEditTool'); break;
  case 43: Photoshop.selectToolPreset('paintbrushTool', 'Hardness 95%'); break;
  case 55: Photoshop.selectToolPreset('paintbrushTool', 'Flow 100%'); break;
  case 67: Photoshop.selectToolPreset('paintbrushTool', 'Flow 10%'); break;
  case 79: Photoshop.selectToolPreset('paintbrushTool', 'Flow 3%'); break;
  case 56: onMakeCleaningClick(); break;
  case 68: Photoshop.swapColors(); break;
  case 80: Photoshop.setDefaultColors(); break;
  // Advanced Tools
  case 28: app.activeDocument.activeLayer.contractMask(); break;
  case 40: onMakeFSClick(); break;
  case 52: onCombineDocumentsClick(); break;
  case 64: onUpdateFromUnderClick(); break;
  case 76: onStampUnderClick(); break;
  case 29: app.activeDocument.activeLayer.expandMask(); break;
  case 41: onMakeMatchClick(); break;
  case 54: onFillEmptyClick(); break;
  case 65: onSmartKeepingMaskClick(); break;
  case 77: onSmartFromUnderClick(); break;
  // Finishing
  case 50: onHighPassSharpeningClick(); break;
  case 62: onMakeWashOutClick(); break;
  case 74: onMakeVignetteClick(); break;
  case 51: onAddNoiseClick(); break;
  case 63: onMakeDBClick(); break;
  case 75: onMakeCookieClick(); break;

  //case : (); break;
  case isNaN(key):
    alert('Invalid key from the macro keyboard.');
    break;
  default:
    alert('No handler for this key: ' + key);
}
