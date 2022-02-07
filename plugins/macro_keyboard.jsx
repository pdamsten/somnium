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
  case 58: Photoshop.selectTool('moveTool'); break;
  // Basic Tools
  case 29: Photoshop.selectTool('curvaturePenTool'); break;
  case 41: Photoshop.selectTool('magicStampTool'); break;
  case 53: Photoshop.selectTool('cloneStampTool'); break;
  case 65: Photoshop.selectTool('spotHealingBrushTool'); break;
  case 77: Photoshop.selectTool('gradientTool'); break;
  case 30: Photoshop.selectTool('typeCreateOrEditTool'); break;
  case 66: Photoshop.selectToolPreset('paintbrushTool', 'Hardness 95%'); break;
  case 78: Photoshop.selectToolPreset('paintbrushTool', 'Flow 100%'); break;
  case 67: Photoshop.selectToolPreset('paintbrushTool', 'Flow 10%'); break;
  case 79: Photoshop.selectToolPreset('paintbrushTool', 'Flow 3%'); break;
  case 54: onMakeCleaningClick(); break;
  case 55: app.activeDocument.activeLayer.fill('foregroundColor'); break;
  case 56: Photoshop.swapColors(); break;
  case 68: Photoshop.setDefaultColors(); break;
  // Advanced Tools
  case 26: app.activeDocument.activeLayer.contractMask(); break;
  case 38: onMakeFSClick(); break;
  case 50: onCombineDocumentsClick(); break;
  case 62: onUpdateFromUnderClick(); break;
  case 74: onStampUnderClick(); break;
  case 27: app.activeDocument.activeLayer.expandMask(); break;
  case 39: onMakeMatchClick(); break;
  case 52: onFillEmptyClick(); break;
  case 63: onSmartKeepingMaskClick(); break;
  case 75: onSmartFromUnderClick(); break;
  // Finishing
  case 48: onHighPassSharpeningClick(); break;
  case 60: onMakeWashOutClick(); break;
  case 72: onMakeVignetteClick(); break;
  case 49: onAddNoiseClick(); break;
  case 61: onMakeDBClick(); break;
  case 73: onMakeCookieClick(); break;

  //case : (); break;
  case isNaN(key):
    alert('Invalid key from the macro keyboard.');
    break;
  default:
    alert('No handler for this key: ' + key);
}
