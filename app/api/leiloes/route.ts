
import { NextResponse } from 'next/server';
import prisma from '../../../utils/prisma'

// Método GET para listar leilões
export async function GET() {
  try {
    const leiloes = await prisma.leilao.findMany();
    return NextResponse.json(leiloes);
  } catch (error) {
    console.error('Erro ao buscar leilões:', error);
    return NextResponse.json({ error: 'Erro ao buscar leilões' }, { status: 500 });
  }
}

// Método POST para criar novos leilões
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const novoLeilao = await prisma.leilao.create({
      data: {
        nome: body.nome,
        preco: body.preco,
        status: 'Aberto',
      },
    });
    return NextResponse.json(novoLeilao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar leilão:', error);
    return NextResponse.json({ error: 'Erro ao criar leilão' }, { status: 500 });
  }
}
