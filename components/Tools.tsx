import fs from 'fs'
import path from 'path'
import Image from 'next/image'

export default async function Tools() {
  const toolsDirectory = path.join(process.cwd(), 'public/images/tools')
  const files = fs.readdirSync(toolsDirectory)
  const svgFiles = files.filter(file => file.endsWith('.svg'))

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Tools & Technologies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {svgFiles.map((file) => (
          <div key={file} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
            <Image
              src={`/images/tools/${file}`}
              alt={file.replace('.svg', '')}
              width={48}
              height={48}
            />
            <span className="mt-2 text-sm text-gray-300">
              {file.replace('.svg', '').replace(/-/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 