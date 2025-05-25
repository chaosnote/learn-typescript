@REM build_proto.bat 0001
mkdir dist
mkdir dist\game_%1
call npm run generate-pbjs -- %1
call npm run generate-pbts -- %1
@REM call npm run echo --gameid=%1