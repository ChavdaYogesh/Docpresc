import os
import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'seed.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

if __name__ == '__main__':
    print('Loading data from', DATA_PATH)
    df = pd.read_csv(DATA_PATH)
    df['symptoms'] = df['symptoms'].astype(str).str.lower()
    X = df['symptoms']
    y = df['label'].astype(str)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    print('Building pipeline...')
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ('clf', LogisticRegression(max_iter=1000, solver='liblinear', multi_class='ovr')),
    ])

    print('Training model...')
    pipeline.fit(X_train, y_train)

    print('Evaluating...')
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print('Accuracy:', round(acc, 4))
    print(classification_report(y_test, y_pred))

    print('Saving model to', MODEL_PATH)
    joblib.dump(pipeline, MODEL_PATH)
    print('Done.')
