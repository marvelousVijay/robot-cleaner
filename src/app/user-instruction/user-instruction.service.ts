import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum Sequence {
    command,
    coordinates,
    direction,
    final
}

interface Coordinates {
    xPosition: number;
    yPosition: number;
}

enum Direction {
    East = 'E',
    West = 'W',
    North = 'N',
    South = 'S'
}

@Injectable({
    providedIn: 'root'
})
export class UserInstructionService {
    botInstructionsCount: number;
    botInstructionSequence = 0;
    userInstructions = [];
    botInstructions = [];
    startingPoint: Coordinates;
    currentPoint: Coordinates;
    pathCoordinates: number[][] = [];
    uniqueCoordinates: number[][] = [];
    distanceCovered = new Subject<number>();

    getInstructionSequenceNumber(inputSequence: number) {
        if (inputSequence === 0) {
            return Sequence.command;
        } else if (inputSequence === 1) {
            return Sequence.coordinates;
        } else if (inputSequence === (this.botInstructionsCount + 1)) {
            return Sequence.final;
        } else {
            return Sequence.direction;
        }
    }

    setBotInstructionsCount(inputValue: string) {
        this.userInstructions.push(inputValue);
        this.botInstructionsCount = +inputValue;
    }

    setBotStartingPoint(inputValue: string) {
        const coordinates = inputValue.split(' ');
        const xPosition = +coordinates[0];
        const yPosition = +coordinates[1];

        this.userInstructions.push(inputValue);
        this.startingPoint = {
          xPosition,
          yPosition
        };
        this.currentPoint = { ...this.startingPoint };
    }

    setBotInstructions(inputValue: string) {
        if (this.botInstructionSequence >= this.botInstructionsCount) {
          return;
        }
        const direction = inputValue.split(' ')[0];
        const distance = +inputValue.split(' ')[1];

        this.traversePath(direction, distance); // get all the robot path coordinates
        this.botInstructions.push(inputValue);
        this.userInstructions.push(inputValue);
        ++this.botInstructionSequence;
    }

    traversePath(direction: string, distance: number) {
        const xStart = this.currentPoint.xPosition;
        const yStart = this.currentPoint.yPosition;
        let xEnd = xStart + distance;
        let yEnd = yStart;
        xEnd = (xEnd > 100000) ? 100000 : xEnd;

        switch (direction) {
          case Direction.East:
            for (let xPos = xStart; xPos <= xEnd; xPos++) {
              for (let yPos = yStart; yPos <= yEnd; yPos++) {
                this.pathCoordinates.push([xPos, yPos]);
              }
            }
            break;
          case Direction.West:
            xEnd = xStart - distance;
            xEnd = (xEnd < -100000) ? -100000 : xEnd;

            for (let xPos = xStart; xPos >= xEnd; xPos--) {
              for (let yPos = yStart; yPos <= yEnd; yPos++) {
                this.pathCoordinates.push([xPos, yPos]);
              }
            }
            break;
          case Direction.North:
            xEnd = xStart;
            yEnd = yStart + distance;
            yEnd = (yEnd > 100000) ? 100000 : yEnd;

            for (let xPos = xStart; xPos <= xEnd; xPos++) {
              for (let yPos = yStart; yPos <= yEnd; yPos++) {
                this.pathCoordinates.push([xPos, yPos]);
              }
            }
            break;
          case Direction.South:
            xEnd = xStart;
            yEnd = yStart - distance;
            yEnd = (yEnd < -100000) ? -100000 : yEnd;

            for (let xPos = xStart; xPos <= xEnd; xPos++) {
              for (let yPos = yStart; yPos >= yEnd; yPos--) {
                this.pathCoordinates.push([xPos, yPos]);
              }
            }
            break;
        }
        this.currentPoint = {
          xPosition: xEnd,
          yPosition: yEnd
        };
    }

    calculateDistanceCleaned() {
        this.uniqueCoordinates = this.getUniquePath(this.pathCoordinates);
        this.distanceCovered.next(this.uniqueCoordinates.length);
        this.resetInstructionsSequence();
    }

    getUniquePath(pathCoordinates: number[][]) {
        const uniquePath = [];
        const itemsFound = {};
        for (const coordinate of pathCoordinates) {
          const coordinateString = JSON.stringify(coordinate);
          if (itemsFound[coordinateString]) {
            continue;
          }
          uniquePath.push(coordinate);
          itemsFound[coordinateString] = true;
        }
        return uniquePath;
    }

    resetInstructionsSequence() {
        this.userInstructions = [];
        this.botInstructionSequence = 0;
        this.pathCoordinates = [];
        this.uniqueCoordinates = [];
    }
}
