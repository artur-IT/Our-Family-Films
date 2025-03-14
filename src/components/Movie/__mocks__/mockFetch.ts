// Mock dla udanego żądania fetch
export const mockSuccessFetch = {
  ok: true,
  json: () => Promise.resolve({ success: true }),
  status: 200,
};

// Mock dla nieudanego żądania fetch
export const mockErrorFetch = {
  ok: false,
  json: () => Promise.reject(new Error("Błąd serwera")),
  status: 500,
};

// Konfiguracja globalnego mocka dla fetch
export const setupFetchMock = (success = true) => {
  global.fetch = jest.fn(() => Promise.resolve(success ? mockSuccessFetch : mockErrorFetch)) as jest.Mock;
};
