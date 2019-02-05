// Within the configs
QUnit.test( "Set Force SSL", function( assert ) {
  assert.ok( oCONFIG.FORCE_SSL == true, "Passed!" );
});

QUnit.test( "Set Anonymize IP", function( assert ) {
  assert.ok( oCONFIG.ANONYMIZE_IP == true, "Passed!" );
});
