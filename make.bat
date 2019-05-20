ZXPSignCmd.exe -selfSignedCert FI PS PetriDamsten "Petri Damsten" "password" Z:\tmp\selfDB.p12
ZXPSignCmd.exe -sign Z:\tmp\com.petridamsten.somnium Z:\tmp\com.petridamsten.somnium.zxp Z:\tmp\selfDB.p12 "password" -tsa http://timestamp.digicert.com/
