/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

export default class CanvasTextSplitter {
  constructor (context, text, maxWidth) {
    this._context = context
    this._text = text
    this._maxWidth = maxWidth
    this._lines = text.split('\n')
  }

  /**
   * Returns the lines that fit the maxWidth
   * @return {Array.<String>}
   */
  getLines () {
    let lines = []
    let newLine = []

    // Iterate over lines
    const linesCount = this._lines.length
    for (let l = 0; l < linesCount; l++) {
      const line = this._lines[l]

      // Iterate over words
      const words = line.split(' ')
      const wordsCount = words.length
      for (let w = 0; w < wordsCount; w++) {
        const word = words[w]

        // Check if line is too wide for the maxwidth
        const width = this._getWidth(newLine.concat(word).join(' '))
        if (width > this._maxWidth) {
          if (newLine.length > 1) {
            // Line too long -> line ended
            lines.push(newLine.join(' '))

            // Start a new line with the word
            newLine = [word]

            // If the next word is too long, split it up
            if (this._getWidth(word) > this._maxWidth) {
              const splitWord = this._splitWord(word)
              lines = lines.concat(splitWord.lines)
              if (splitWord.rest) {
                newLine = [splitWord.rest]
              }
            }
          } else {
            // Line too long, but only one word - split it up into
            // multiple lines
            const splitWord = this._splitWord(word)
            lines = lines.concat(splitWord.lines)
            if (splitWord.rest) {
              newLine = [splitWord.rest]
            } else {
              newLine = []
            }
          }
        } else {
          newLine.push(word)
        }
      }

      lines.push(newLine.join(' '))
      newLine = []
    }

    return lines
  }

  /**
   * Splits up the given word to fit the max width
   * @param  {String} word
   * @return {Object}
   * @private
   */
  _splitWord (word) {
    let response = {
      lines: [],
      rest: null
    }

    const wordLength = word.length
    let chars = []
    for (let c = 0; c < wordLength; c++) {
      const char = word[c]
      if (this._getWidth(chars.concat(char).join('')) > this._maxWidth) {
        response.lines.push(chars.join(''))
        chars = [char]
      } else {
        chars.push(char)
      }

      if (c === wordLength - 1 && chars.length > 0) {
        response.rest = chars.join('')
      }
    }

    return response
  }

  /**
   * Returns the measured width for the given string
   * @param  {String} string
   * @return {Number}
   * @private
   */
  _getWidth (string) {
    return this._context.measureText(string).width
  }
}