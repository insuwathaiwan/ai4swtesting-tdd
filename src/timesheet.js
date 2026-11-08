/**
 * Records hours worked per project.
 *
 * Units: every duration passed in and returned is in HOURS (decimal hours,
 * e.g. 1.5 = 1 hour 30 minutes). Internally, durations are stored as whole
 * MINUTES (integers) so that totals are exact and free of floating-point drift.
 */

const MINUTES_PER_HOUR = 60;
const MAX_HOURS_PER_SUBMISSION = 24;
// Tolerance for deciding whether hours * 60 is a whole number of minutes.
const MINUTE_EPSILON = 1e-9;

class Timesheet {
  /** @type {Map<string, {projectName: string, minutes: number}>} */
  #timesheets;

  /**
   * @param {Map} [store] Optional shared store, so several Timesheet instances
   *   can work on the same data instead of each keeping its own totals.
   */
  constructor(store = new Map()) {
    if (!(store instanceof Map)) {
      throw new TypeError('store must be a Map');
    }
    this.#timesheets = store;
  }

  /**
   * Adds hours to a project.
   * @param {string} projectName Non-empty project name. Case, surrounding
   *   whitespace and repeated inner whitespace are ignored when matching projects.
   * @param {number} duration Hours worked: a finite number > 0 and <= 24,
   *   expressed to whole-minute precision.
   * @returns {true} Always true on success; invalid input throws instead.
   * @throws {TypeError|RangeError} When the input is invalid.
   */
  submitTimesheet(projectName, duration) {
    const displayName = Timesheet.#validateProjectName(projectName);
    const minutes = Timesheet.#hoursToMinutes(duration);
    const key = Timesheet.#normalizeKey(displayName);

    const existing = this.#timesheets.get(key);
    const total = (existing ? existing.minutes : 0) + minutes;
    if (!Number.isSafeInteger(total)) {
      throw new RangeError(`Total hours for "${displayName}" exceed the supported range`);
    }

    this.#timesheets.set(key, {
      // Keep the first spelling used so the project name is always shown the same way.
      projectName: existing ? existing.projectName : displayName,
      minutes: total,
    });
    return true;
  }

  /**
   * @returns {ReadonlyArray<Readonly<{projectName: string, hours: number}>>}
   *   One entry per project, sorted by project name (case-insensitive), so the
   *   same data always comes back in the same order whatever order it was entered in.
   */
  getTimesheets() {
    return [...this.#timesheets.entries()]
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([, entry]) =>
        Object.freeze({
          projectName: entry.projectName,
          hours: entry.minutes / MINUTES_PER_HOUR,
        })
      );
  }

  /**
   * @param {string} projectName
   * @returns {number} Total hours for the project; 0 if nothing has been submitted.
   * @throws {TypeError} When projectName is not a non-empty string.
   */
  getTotalTimesheetHours(projectName) {
    const key = Timesheet.#normalizeKey(Timesheet.#validateProjectName(projectName));
    const entry = this.#timesheets.get(key);
    return entry ? entry.minutes / MINUTES_PER_HOUR : 0;
  }

  static #validateProjectName(projectName) {
    if (typeof projectName !== 'string') {
      throw new TypeError('projectName must be a string');
    }
    const trimmed = projectName.trim().replace(/\s+/g, ' ');
    if (trimmed === '') {
      throw new TypeError('projectName must not be empty');
    }
    return trimmed;
  }

  static #normalizeKey(displayName) {
    return displayName.toLowerCase();
  }

  static #hoursToMinutes(duration) {
    if (typeof duration !== 'number' || !Number.isFinite(duration)) {
      throw new TypeError('duration must be a finite number of hours');
    }
    if (duration <= 0) {
      throw new RangeError('duration must be greater than 0 hours');
    }
    if (duration > MAX_HOURS_PER_SUBMISSION) {
      throw new RangeError(`duration must not exceed ${MAX_HOURS_PER_SUBMISSION} hours`);
    }
    const rawMinutes = duration * MINUTES_PER_HOUR;
    const minutes = Math.round(rawMinutes);
    if (Math.abs(rawMinutes - minutes) > MINUTE_EPSILON) {
      throw new RangeError('duration must be a whole number of minutes (e.g. 0.25, 1.5)');
    }
    return minutes;
  }
}

module.exports = Timesheet;
