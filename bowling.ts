import {
  DosEmulator,
  GameTools,
  DropJoystick,
  GamepadController,
  AsciiMapping,
} from '../../api/api.js';
import { buttons } from './bowling-controls.js';
import { PixelListener } from '../../api/lib/PixelListener.js';
import { BOWLING_DIGITS } from './bowling-digits.js';
import { Ocr } from '../../api/lib/Ocr.js';

/**
 * ### BOWLING ###
 * Pass through global variables (from other script tags) and/or required DOM elements that the game needs to run
 * @param dos the JsDos "dos" element
 * @param canvasContainer the container in which JsDos can pop all it's elements (i.e. the DOS game canvas)
 * @param emulators a required DOSBox global variable
 * @param controlCanvas the canvas (overlay) that we created in order to display the DropJoystick over the game canvas
 * @param instructions the instructions "screen". Think DIV
 * @param loading the loading "screen". Think DIV
 * @param window the DOM window object
 */
//Setup
export const runBowling = (
  dos: any,
  canvasContainer: HTMLDivElement,
  emulators: any,
  controlCanvas: HTMLCanvasElement,
  loading: HTMLElement,
  instructions: HTMLDivElement,
  window: Window
) => {
  GameTools.disableBrowserShortcuts();
  //Score ocr
  let startXScore = 233;
  let startYScore = 17;
  let charWidthScore = 6;
  let charHeightScore = 7;
  let charSpacingScore = 2;
  let numCharsScore = 3;
  let thousandsSeparatorWidthScore = 0;

  let ocrScore: Ocr = new Ocr(
    startXScore,
    startYScore,
    charWidthScore,
    charHeightScore,
    charSpacingScore,
    numCharsScore,
    thousandsSeparatorWidthScore,
    BOWLING_DIGITS
  );

  /*** Setup and Start DOS Game ***/
  let dosGame = new DosEmulator(dos, canvasContainer, emulators);
  instructions.addEventListener('click', () => {
    instructions.style.display = 'none';
    loading.style.display = 'none';
    //Start Game
    dosGame.start('/games/bowling/bowling.jsdos').then((_ci) => {
      //Setup Joystick
      let joystick: DropJoystick = new DropJoystick(
        window,
        controlCanvas,
        buttons,
        dosGame
      );
      //Resize Canvas
      window.addEventListener('resize', () => joystick.resize());
      //Watch Pixels
      let pixelListener: PixelListener = dosGame.getPixelListenerInstance();
      pixelListener.addWatch(268, 188);
      pixelListener.addWatch(270, 188);
      pixelListener.addWatch(274, 61);
      pixelListener.addWatch(278, 63);
      pixelListener.addWatch(150, 18);
      // pixelListener.addWatch(218,93)

      //Query for pixels
      // setInterval(() => {
      //   pixelListener.query().then((value) => {
      //     console.log('COLOUR: ', value);
      //   })
      // }, 1000)

      //Query Screenshots
      setInterval(() => {
        dosGame.getScreenshot().then((values) => {
          console.log(values);
        });
      }, 1000);

      enum state {
        LOADING,
        PLAYING,
        GAME_OVER,
      }

      let currentState = state.LOADING;
      let latestScore = 0;

      //State Machine Logic
      setInterval(() => {
        pixelListener.query().then((values) => {
          dosGame.getScreenshot().then((imageData) => {
            ocrScore.readDigits(imageData).then((score) => {
              if (values[0] == '#ffff55' && values[1] == 'ffff55') {
                console.log('Game Over: ', currentState);

                currentState = state.GAME_OVER;

                window.postMessage(
                  {
                    event: 'LEVEL_END',
                    score: latestScore,
                    gameID: '10th Frame',
                  },
                  '*'
                );

                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } else if (currentState === state.LOADING) {
                console.log('Loading State: ', currentState);
                loading.style.display = 'flex';
                if (values[2] === '#ffff55' && values[3] === '#000000') {
                  loading.style.display = 'none';
                  currentState = state.PLAYING;
                  // console.log('loading timed with pixel listener on background');
                }
              } else if (currentState === state.PLAYING) {
                dosGame.pressAndReleaseKeySynch(AsciiMapping.D);
                if (values[4] == '000000') {
                  dosGame.pressAndReleaseKeySynch(AsciiMapping.SPACE);
                  // console.log('SpaceBar Succesfull');
                }
                console.log('Playing state: ', currentState);
                latestScore = score;
              } else {
                console.log(currentState);
              }
            });
          });
        });
      }, 1000);
    });
  });
};

//212 ,188
