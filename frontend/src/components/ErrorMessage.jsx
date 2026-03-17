export default function ErrorMessage({ message = 'Something went wrong.' }) {
  return (
    <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
      {message}
    </div>
  )
}
