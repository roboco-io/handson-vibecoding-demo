// jest-dom은 DOM 노드에 대한 assertion을 위한 사용자 정의 jest matcher를 추가합니다.
// 이를 통해 toBeInTheDocument()와 같은 메서드를 사용할 수 있습니다.
import '@testing-library/jest-dom';

// 타입스크립트에서 jest-dom의 확장 메서드를 인식할 수 있도록 타입 정의 추가
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }
}
