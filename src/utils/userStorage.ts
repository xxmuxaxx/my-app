/** Класс для работы с localStorage. */
class UserStorage {
  /**
   * Установить запись в localStorage.
   * @param {string} key - Ключ записи.
   * @param {string} value - Значение записи.
   */
  set(key: string, value: unknown): void {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  /**
   * Получить запись из localStorage.
   * @param {string} key - Ключ записи.
   * @return {string|null} Возвращает строку или Null
   */
  get<T>(key: string): T | null {
    let parsed;

    try {
      parsed = JSON.parse(localStorage.getItem(key) as string);
    } catch {
      parsed = localStorage.getItem(key);
    }

    return parsed as T | null;
  }

  /**
   * Удалить запись из localStorage.
   * @param {string} key - Ключ записи.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

export const userStorage = new UserStorage();
